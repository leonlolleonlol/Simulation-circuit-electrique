let draggedElement; // L'élement qui est déplacer
let draggedFil;// à supprimer
let selection;
let origin; // variable qui permet de savoir lorsque l'on crée un nouveau élément.
//Lorsque l'on ajoute un composant, le composant sélectionner disparaît dans le sélectionneur
// et pour cela, on doit savoir quel composant panneau de choix est l'orignie
let components;// Liste de composants du circuit
// Très important que cette liste soit lorsque merge avec modèle

//À supprimer dans de futur release
let fils;

// Variable nécessaire pour placer la grille
let grid;
let composants_panneau; // Le panneau de choix des composants


// Initialisation du circuit
function setup() {
  createCanvas(windowWidth - 50, windowHeight - 30);
  //----------------------------------------
  let reset_button = createButton('Recommencer');
  reset_button.position(40, 750);
  reset_button.size(120, 50);
  reset_button.mousePressed(refresh);
  let undo_button = createButton('Undo');
  undo_button.position(40, 195);
  undo_button.size(120, 50);
  undo_button.mousePressed(undo);
  //-----------------------------------------
  initComponents();
}



function initComponents(){
  fils = [];
  components = [];
  draggedElement = null;
  draggedFil = null;
  origin = null;
  grid = {
    offsetX: 300,
    offsetY: 20,
    tailleCell: 30,
    translateX: 0,
    translateY: 0,
    quadrillage: 'point',
  };
  // Composants dans le panneau de choix
  composants_panneau=[new Resisteur(58, 265, 25),
                      new Batterie(58, 315),
                      new Ampoule(58, 365, 40),
                      new Diode(58, 415, 'right'),
                      new Condensateur(60, 465, 'right')];
}

/**
 * Effectue les éléments suivant:
 * 1. Changer le background
 * 2. Dessiner la grille
 * 3. Dessiner les fils et composants
 * 4. Dessiner le panneau de choix des composants
 */
function draw() {
  background(220);// Mettre le choix de couleur pour le background

  //Dessiner la grille dépendant du du parametre
  if (grid.quadrillage == 'point')
    drawPointGrid();
  else if (grid.quadrillage == 'line')
  drawLineGrid();
  else drawPointLineGrid();
  for (let element of components) {
    element.draw(grid.translateX, grid.translateY);
  }
  drawFils();
  drawComponentsChooser();
  /*
  * Solution temporaire pour que le composant s'affiche par dessus 
  * le reste déplacer du panneau de choix
  */
  if (origin != null) {
    draggedElement.draw(grid.translateX, grid.translateY);
  }
}

function drawComponentsChooser() {
  push();
  noStroke();
  fill(220);
  rect(0, 0, grid.offsetX - 5, windowHeight);
  fill("rgba(128,128,128,0.59)");
  strokeWeight(4);
  stroke("rgba(52,52,52,0.78)");
  for (let i = 0; i < 10; i++) {
    rect(0, 240 + 50 * i, 120, 50);
  }
  for (let element of composants_panneau){
    if (element != origin)
      element.draw(0, 0);
  }
  pop();
}

// GRILLE ------------------------------------------
function drawPointGrid() {
  stroke("black");
  setGrid();
}
function setGrid() {
  push();
  strokeWeight(6);
  for (let i = 0; i * grid.tailleCell < windowWidth - grid.offsetX; i++) {
    for (let j = 0; j * grid.tailleCell < windowHeight - grid.offsetY; j++) {
      if (
        !(grid.translateX % grid.tailleCell < 0 && i == 0) &&
        !(grid.translateY % grid.tailleCell < 0 && j == 0)
      )
        point(
          grid.offsetX + i * grid.tailleCell + (grid.translateX % grid.tailleCell),
          grid.offsetY + j * grid.tailleCell + (grid.translateY % grid.tailleCell)
        );
    }
  }
  pop();
}
function drawPointLineGrid() {
  push();
  drawLineGrid();
  stroke("gray");
  setGrid();
  pop();
}

function drawLineGrid() {
  push();
  var borne = 0;
  stroke("black");
  strokeWeight(2);
  while (borne * grid.tailleCell < windowWidth - grid.offsetX) {
    if (!(grid.translateX % grid.tailleCell < 0 && borne == 0))
      line(
        grid.offsetX + borne * grid.tailleCell + (grid.translateX % grid.tailleCell),
        grid.offsetY,
        grid.offsetX + borne * grid.tailleCell + (grid.translateX % grid.tailleCell),
        windowHeight
      );
    borne++;
  }
  borne = 0;
  while (borne * grid.tailleCell < windowHeight - grid.offsetY) {
    if (!(grid.translateY % grid.tailleCell < 0 && borne == 0))
      line(
        grid.offsetX,
        grid.offsetY + borne * grid.tailleCell + (grid.translateY % grid.tailleCell),
        windowWidth,
        grid.offsetY + borne * grid.tailleCell + (grid.translateY % grid.tailleCell)
      );
    borne++;
  }
  pop();
}
// ---------------------------------------------------------

// Function temporaire en attendant d'avoir un objet fil
function drawFils() {
  push();
  stroke("orange");
  strokeWeight(4);
  for (let element of fils){
    if (element != null)
      line(element.xi + grid.translateX, element.yi + grid.translateY, element.xf + grid.translateX, element.yf + grid.translateY);
  }
  pop();
}

  /**
   * Permet de trouver la position idéal en x à partir de la 
   * position de la souris
   * @param {*} offset 
   * @returns Le point en x le plus proche sur la grille
   */
function findGridLockX(offset) {
  return (
    round(
      (mouseX - grid.offsetX - offset) / grid.tailleCell
    ) *
    grid.tailleCell +
    grid.offsetX
  );
}
/**
 * Permet de trouver la position idéale en y à partir de la 
 * positinon de la souris
 * @param {*} offset 
 * @returns Le point en y le plus proche sur la grille
 */
function findGridLockY(offset) {
  return (
    round((mouseY - grid.offsetY - offset) / grid.tailleCell) * grid.tailleCell +
    grid.offsetY
  );
}
function isElementDrag(element){
  return draggedElement!=null && draggedElement === element;
}

function isElementSelectionner(element){
  return selection!=null && selection === element;
}

function mousePressed() {
  selection = null;
  // Vérification drag panneau de choix
  for (let i = 0; i < composants_panneau.length; i++) {
    const element = composants_panneau[i];
    var new_element;
    if (element.inBounds(mouseX, mouseY, 0, 0)){
      origin = element;
      // Création d'un nouveau composants selon le composant sélectionner
      if(element.getType() == 'batterie'){
        new_element = new Batterie(element.x - grid.translateX, element.y - grid.translateY);
      }else if(element.getType() == 'resisteur'){
        new_element = new Resisteur(element.x - grid.translateX, element.y - grid.translateY);
      }else if(element.getType() == 'ampoule'){
        new_element = new Ampoule(element.x - grid.translateX, element.y - grid.translateY);
      }else if(element.getType() == 'condensateur'){
        new_element = new Condensateur(element.x - grid.translateX, element.y - grid.translateY, 'right');
      }else if(element.getType() == 'diode'){
        new_element = new Diode(element.x - grid.translateX, element.y - grid.translateY, 'right');
      }
      new_element.xOffsetDrag = mouseX - element.x;
      new_element.yOffsetDrag = mouseY - element.y;
      // Autres ajout dans les modules
      components.push(new_element);
      draggedElement = new_element;
      selection = new_element;
      addActions( { type: CREATE, objet: new_element }, 0);
    }

  } 
  // Vérification drag parmis les composants de la grille
  if(draggedElement == null) {
    for (let element of components) {
      if (element.inBounds(mouseX, mouseY, grid.translateX, grid.translateY)) {
        draggedElement = element;
        selection = element;
        draggedElement.xOffsetDrag = mouseX - draggedElement.x;
        draggedElement.yOffsetDrag = mouseY - draggedElement.y;
        break;
      }
    }//mouseX - offsetX > element.x - 10
    if (mouseX > 329) {
      if (draggedElement == null) {
        if
          (
          (((mouseX - grid.offsetX - grid.translateX) % grid.tailleCell < 20 ||
            (mouseX - grid.offsetX - grid.translateX + 20) % grid.tailleCell < 20)) &&
          (((mouseY - grid.offsetY - grid.translateY) % grid.tailleCell < 20 ||
            (mouseY - grid.offsetY - grid.translateY + 20) % grid.tailleCell < 20))
        ) {
            let x_point = findGridLockX(grid.translateX);
            let y_point = findGridLockY(grid.translateY)
          fil = {
            xi: x_point,
            yi: y_point,
            xf: x_point,
            yf: y_point,
            type: "fil",
          };
          draggedFil = fil;
          fils.push(fil);
          addActions({type:CREATE,objet:fil});
        }
      }
    }
  }
  if(draggedElement == null && draggedFil == null) {
    if(mouseX>grid.offsetX && mouseY> grid.offsetY)
      draggedElement = grid;
  }
}

function mouseDragged() {
  if (draggedElement != null && origin != null) {
    //cursor('grabbing');
    draggedElement.x = findGridLockX(
      draggedElement.xOffsetDrag + grid.translateX
    );
    draggedElement.y = findGridLockY(
      draggedElement.yOffsetDrag + grid.translateY
    );
  }
  else if (draggedElement != null) {
    if(draggedElement === grid){
      //cursor(MOVE);
      grid.translateX += mouseX - pmouseX;
      grid.translateY += mouseY - pmouseY;
    } else{
    //cursor('grabbing');
    draggedElement.x = findGridLockX(
      draggedElement.xOffsetDrag
    );
    draggedElement.y = findGridLockY(
      draggedElement.yOffsetDrag
    );
  } else if (draggedFil != null) {
    draggedFil.xf = findGridLockX(grid.translateX);
    draggedFil.yf = findGridLockY(grid.translateY);
  }
}

function mouseReleased() {
  // Arrète le drag si il y en avait un en cours
  //cursor(ARROW);
  if (draggedElement != null && origin !=null) {
    draggedElement.drag = false;
    draggedElement = null;
    origin = null;
  } else if(draggedElement != null){
    let action = {type:MODIFIER, objet:draggedElement, changements:[
			{attribut:'x', ancienne_valeur:draggedElement.pastX, nouvelle_valeur:draggedElement.x},
      {attribut:'y', ancienne_valeur:draggedElement.pastY, nouvelle_valeur:draggedElement.y}]};
    draggedElement.pastX = null;
    draggedElement.pastY = null;
    draggedElement = null;
    addActions(action);
  } else if (draggedFil != null) {
    draggedFil = null;
  }
}

function keyPressed() {
 /*
  * Gestion des raccourcis clavier.
  * Pour trouver les codes des combinaisons,
  * aller voir https://www.toptal.com/developers/keycode
  */
  if (keyIsDown(CONTROL) && keyIsDown(SHIFT) && keyCode === 90) {
    redo();
  } else if (keyIsDown(CONTROL) && keyCode === 90) {
    undo();
  } else if (keyCode === 8) {
    if(selection!=null){
      let element = components.splice(components.indexOf(selection),1)[0];
      addActions({type:DELETE,objet:element});
      selection = null;
    }
  } //else if (keyIsDown(CONTROL) && keyIsDown(SHIFT) && keyCode === 80) {
  //  print('parameters')
  //}
}

/*
 * Efface tout les composants sur la grille et remet tout les 
 * système à zéro.
 */
function refresh() {
  initComponents();
}
