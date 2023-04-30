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

// liens vers des éléments DOM utiles
let acceuil_button;
let undo_button;
let reset_button;
let pause_button;
let stop_button;
let point_grid_button;
let line_grid_button;
let point_line_grid_button;
let canvas;

let c1 = new Circuit(false);

let backgroundColor = 'rgb(51,51,51)';//220

// Initialisation du circuit
function setup() {
  canvas = createCanvas(windowWidth - 50, windowHeight - 30);
  acceuil_button = select('#acceuil');
  line_grid_button = select('#line-grid');
  point_grid_button = select('#point-grid');
  point_line_grid_button = select('#point-line-grid');
  positionCanvas=canvas.position();
  //----------------------------------------
  acceuil_button.position(10,10);
  reset_button = createButton('Recommencer');
  reset_button.position(positionCanvas.x, 450);
  reset_button.size(120, 50);
  reset_button.mousePressed(refresh);
  undo_button = createButton('Undo');
  undo_button.position(positionCanvas.x, 95);
  undo_button.size(120, 50);
  undo_button.mousePressed(undo);
  let img_line = select('#img-line-grid');
  let img_point = select('#img-point-grid');
  let img_dotLine = select('#img-point-line-grid');
  img_line.size(24,24);
  img_point.size(24,24);
  img_dotLine.size(24,24);//code redondant
  line_grid_button.position(positionCanvas.x,150);
  point_grid_button.position(positionCanvas.x +40,150);
  point_line_grid_button.position(positionCanvas.x + 80,150);
  line_grid_button.mousePressed(function(){ grid.quadrillage='line';});
  point_grid_button.mousePressed(function(){ grid.quadrillage='point';});
  point_line_grid_button.mousePressed(function(){ grid.quadrillage='points&lines';});

  //-----------------------------------------
  initComponents();
  test();
}

function test(){
  p1 = new Batterie(0, 0, 12);
  r1 = new Resisteur(0, 0, 500)
  
  n1 = new Noeuds();
  
  c2 = new Circuit();
  c3 = new Circuit();

  r2 = new Resisteur(0, 0, 800);
  r3 = new Resisteur(0, 0, 1100);
  r4 = new Resisteur(0, 0, 400); 
  

  r5 = new Resisteur(0, 0, 400);
  r6 = new Resisteur(0, 0, 250);
  r7 = new Resisteur(0, 0, 100);
  c4 = new Circuit();
  c5 = new Circuit();
  n2 = new Noeuds();
  c4.ajouterComposante(r5);
  c4.ajouterComposante(r6);
  c5.ajouterComposante(r7);
  n2.ajouterComposante(c4);
  n2.ajouterComposante(c5);

  c2.ajouterComposante(r4);
  c2.ajouterComposante(r3);
  c3.ajouterComposante(r2);
  c3.ajouterComposante(n2);

  n1.ajouterComposante(c2);
  n1.ajouterComposante(c3);
/*
  n2 = new Noeuds();
  c4 = new Circuit(false);
  c4.ajouterComposanteALaFin(new Condensateur(0, 0, 15));
  c4.ajouterComposanteALaFin(new Condensateur(0, 0, 25));
  c4.ajouterComposanteALaFin(new Condensateur(0, 0, 35));
  n2.ajouterComposanteALaFin(c4);

  c3 = new Circuit(false);
  c3.ajouterComposanteALaFin(new Condensateur(0, 0, 90));
  c3.ajouterComposanteALaFin(new Diode(0, 0, "wrong"));
  c3.ajouterComposanteALaFin(n2);
  n1.ajouterComposanteALaFin(c3);
  */
  
  c1.ajouterComposante(n1);
  c1.ajouterComposante(r1);
  c1.ajouterComposante(p1);

  c1.connectComposante(p1, r1);
  c1.connectComposante(r1, n1);
  c1.connectComposante(n1, p1);
  c1.update();

  
  
  print(r1.courant.round(5) + " " + r1.tension.round(2));
  print(r2.courant.round(5) + " " + r2.tension.round(2));
  print(r3.courant.round(5) + " " + r3.tension.round(2));
  print(r4.courant.round(5) + " " + r4.tension.round(2));
  
  c1.solveCourrantkirchhoff();
}

//Source: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary 
Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

function initComponents(){
  fils = [];
  components = [];
  draggedElement = null;
  draggedFil = null;
  origin = null;
  grid = {
    offsetY: 20,
    tailleCell: 30,
    translateX: 0,
    translateY: 0,
    quadrillage: 'point',
  };
  initPosition();
  // Composants dans le panneau de choix
  composants_panneau=[new Resisteur(58, 265, 25),
                      new Batterie(58, 315),
                      new Ampoule(58, 365, 40),
                      new Diode(58, 415, 'right'),
                      new Condensateur(60, 465, 'right')];
}
function initPosition(){
  grid.offsetX = max(200 * width/1230,138) ;
}

/**
 * Effectue les éléments suivant:
 * 1. Changer le background
 * 2. Dessiner la grille
 * 3. Dessiner les fils et composants
 * 4. Dessiner le panneau de choix des composants
 */
function draw() {
  background(backgroundColor);// Mettre le choix de couleur pour le background
  if(undo_list.length == 0)
	undo_button.attribute('disabled', '');
  else
	undo_button.removeAttribute('disabled');
  //Dessiner la grille dépendant du du parametre
  if (grid.quadrillage == 'point')
    drawPointGrid();
  else if (grid.quadrillage == 'line')
  drawLineGrid();
  else drawPointLineGrid();
  
  drawFils();
  for (let element of components) {
    element.draw(grid.translateX, grid.translateY);
  }
  
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
  fill(backgroundColor);
  rect(0, 0, grid.offsetX - 5, windowHeight);
  fill("rgba(128,128,128,0.59)");
  strokeWeight(4);
  stroke("rgba(52,52,52,0.78)");
  for (let i = 0; i <composants_panneau.length ; i++) {
    rect(0, 190 + 50 * i, 120, 50);
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

function validFilBegin(){
let x = mouseX - grid.offsetX - grid.translateX;
let y = mouseY - grid.offsetY - grid.translateY;
  if (mouseX <= grid.offsetX || mouseY <= grid.offsetY)
    return false;
  else if (!((x % grid.tailleCell < 20 ||
            (x + 20) % grid.tailleCell < 20) &&
          (y % grid.tailleCell < 20 ||
            (y + 20) % grid.tailleCell < 20)))
    return false;
  else {
    let xd = mouseX - grid.translateX;
    let yd = mouseY - grid.translateY;
    for(let i=0;i<components.length;i++)
      if(components[i].checkConnection(xd, yd, 10))
        return true; 
    for(let i=0;i<fils.length;i++){
      if(fils[i].yi!=fils[i].yf && fils[i].xi!=fils[i].xf){
        if(dist(min(fils[i].xi,fils[i].xf),min(fils[i].yi,fils[i].yf),xd,yd)<10 ||
           dist(max(fils[i].xi,fils[i].xf),min(fils[i].yi,fils[i].yf),xd,yd)<10 ||
           dist(min(fils[i].xi,fils[i].xf),max(fils[i].yi,fils[i].yf),xd,yd)<10 ||
           dist(max(fils[i].xi,fils[i].xf),max(fils[i].yi,fils[i].yf),xd,yd)<10)
          return true;
      } else {
        let x1 = min(fils[i].xi-10, fils[i].xf-10)
        let x2 = max(fils[i].xi+10, fils[i].xf+ 10);
        let y1 = min(fils[i].yi-10, fils[i].yf-10);
        let y2 = max(fils[i].yi+10, fils[i].yf+10);
        if(xd > x1 && xd < x2 && yd > y1 -10 && yd < y2 + 10)
          return true;
      }
    }
  } 
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
  }
  if (draggedElement == null && validFilBegin()) {
    let x_point = findGridLockX(grid.translateX);
    let y_point = findGridLockY(grid.translateY)
    let fil = {
        xi: x_point,
        yi: y_point,
        xf: x_point,
        yf: y_point,
        type: "fil",
    };
    draggedFil = fil;
    selection = fil;
    fils.push(fil);
    addActions({type:CREATE,objet:fil});
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
    }
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
      if(draggedFil.xi == draggedFil.xf && draggedFil.yi == draggedFil.yf)
	fils.pop();
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
  } else if (keyCode === 82) {
    let newR = new Resisteur(findGridLockX(grid.translateX), findGridLockY(grid.translateY));
    components.push(newR);
    addActions({type:CREATE,objet:newR});
  } else if (keyCode === 83) {
    let newB = new Batterie(findGridLockX(grid.translateX), findGridLockY(grid.translateY));
    components.push(newB);
    addActions({type:CREATE,objet:newB});
  } else if (keyCode === 67) {
    let newC = new Condensateur(findGridLockX(grid.translateX), findGridLockY(grid.translateY));
    components.push(newC);
    addActions({type:CREATE,objet:newC});
  } //else if (keyIsDown(CONTROL) && keyIsDown(SHIFT) && keyCode === 80) {
  //  print('parameters')
  //}
}
function windowResized(){
  resizeCanvas(windowWidth - 50, windowHeight - 30);
  initPosition();
}

/*
 * Efface tout les composants sur la grille et remet tout les 
 * système à zéro.
 */
function refresh() {
  initComponents();
}
