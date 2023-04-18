let drag; // L'élement qui est déplacer
let selection;
let origin; // variable qui permet de savoir lorsque l'on crée un nouveau élément.
//Lorsque l'on ajoute un composant, le composant sélectionner disparaît dans le sélectionneur
// et pour cela, on doit savoir quel composant panneau de choix est l'orignie
let components;// Liste de composants du circuit
// Très important que cette liste soit lorsque merge avec modèle

let fils;// Liste des fils du circuit

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

let undo_desactive = false;
let c1; //variable contenant l'instance du circuit. Sert pour les calculs

let backgroundColor = 'rgb(51,51,51)';//220

// Initialisation du circuit
function setup() {
  canvas = createCanvas(windowWidth - 50, windowHeight - 30);
  acceuil_button = select('#acceuil');
  line_grid_button = select('#line-grid');
  point_grid_button = select('#point-grid');
  point_line_grid_button = select('#point-line-grid');
  undo_button = select('#undo');
  reset_button = select('#redo');
  let positionCanvas=canvas.position();
  //----------------------------------------
  reset_button.mousePressed(refresh);
  undo_button.mousePressed(undo);
  line_grid_button.mousePressed(function(){ grid.quadrillage='line';});
  point_grid_button.mousePressed(function(){ grid.quadrillage='point';});
  point_line_grid_button.mousePressed(function(){ grid.quadrillage='points&lines';});
  c1 = new Circuit(true);

  //-----------------------------------------
  initComponents();

  //test();
}


function test(){
  c1.ajouterComposanteALaFin(new Batterie(0, 0, 10));
  n1 = new Noeuds();

  
  c2 = new Circuit(false);
  c2.ajouterComposanteALaFin(new Resisteur(0, 0, 30));
  c2.ajouterComposanteALaFin(new Resisteur(0, 0, 40));
  n1.ajouterComposanteALaFin(c2);
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
  
  c1.ajouterComposanteALaFin(n1);
  */
  c1.ajouterComposanteALaFin(new Resisteur(0, 0, 10))
  
  c1.update();
  print(c1.circuit[1].courant);
  print(c1.circuit[2].courant);
}

function initComponents(){
  fils = [];
  components = [];
  drag = null;
  selection = null;
  origin = null;
  grid = {
    offsetY: 30,
    tailleCell: 30,
    translateX: 0,
    translateY: 0,
    scale:1,
    quadrillage: 'point',
  };
  initPosition();
  // Composants dans le panneau de choix
  composants_panneau=[new Resisteur(58, 215, 25),
                      new Batterie(58, 265),
                      new Ampoule(58, 315, 40),
                      new Diode(58, 365, 'right'),
                      new Condensateur(60, 415, 'right')];
}
function initPosition(){
  grid.offsetX = round(max(200 * width/1230,138)/grid.tailleCell)*grid.tailleCell / grid.scale;
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
  if(undo_list.length == 0 && !undo_desactive){
	  undo_button.attribute('disabled', '');
    reset_button.attribute('disabled', '');
    undo_desactive = true;
  }
  else if(undo_list.length != 0 && undo_desactive){
	  undo_button.removeAttribute('disabled');
    reset_button.removeAttribute('disabled');
    undo_desactive = false;
  }
  push();
  scale(grid.scale);
  drawGrid();
  drawFils();
  drawComposants();
  push();
  noStroke();
  fill(backgroundColor);
  rect(0, 0, grid.offsetX - 5, windowHeight);
  pop();
  push();
  scale(1/grid.scale);
  drawComponentsChooser();
  pop();
  if (origin != null) {
    drag.draw(grid.translateX, grid.translateY);
  }
}

function drawComponentsChooser() {
  push();
  fill("rgba(128,128,128,0.59)");
  strokeWeight(4);
  stroke("rgba(52,52,52,0.78)");
  for (let i = 0; i <composants_panneau.length ; i++) {
    rect(0, 190 + 50 * i, 120, 50);
    if (composants_panneau[i] != origin)
      composants_panneau[i].draw(0, 0);
  }
  pop();
}

function drawGrid(){
  stroke(backgroundColor);
  strokeWeight(2);
  if (grid.quadrillage == 'point')
    drawPointGrid();
  else if (grid.quadrillage == 'line')
    drawLineGrid();
  else if(grid.quadrillage == 'points&lines')
    drawPointLineGrid();
}

function drawFils() {
  push();
  stroke("orange");
  strokeWeight(4);
  for (let element of fils){
    line(element.xi + grid.translateX, element.yi + grid.translateY, element.xf + grid.translateX, element.yf + grid.translateY);
    //temporaire avant d'avoir objet fil
  }
  pop();
}

function drawComposants(){
  for (let element of components) {
    element.draw(grid.translateX, grid.translateY);
  }
}

// GRILLE ------------------------------------------



function drawPointGrid() {
  stroke("black");
  setGrid();
}
function setGrid() {
  push();
  strokeWeight(6);
  for (let i = 0; i < width/grid.scale - grid.offsetX; i+=grid.tailleCell) {
    for (let j = 0; j < height/grid.scale - grid.offsetY ; j+=grid.tailleCell) {
      if (
        !((grid.translateX % grid.tailleCell) < 0 && i == 0) &&
        !((grid.translateY % grid.tailleCell) < 0 && j == 0)
      )
        point(
          grid.offsetX + i + ((grid.translateX-grid.offsetX) % grid.tailleCell),
          grid.offsetY + j + ((grid.translateY-grid.offsetY) % grid.tailleCell)
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
  while (borne  < windowWidth/grid.scale - grid.offsetX) {
    if (!(grid.translateX % grid.tailleCell < 0 && borne == 0))
      line(
        grid.offsetX + borne + ((grid.translateX-grid.offsetX) % grid.tailleCell),
        grid.offsetY,
        grid.offsetX + borne + ((grid.translateX-grid.offsetX) % grid.tailleCell),
        windowHeight/grid.scale
      );
    borne+= grid.tailleCell;
  }
  borne = 0;
  while (borne < windowHeight/grid.scale - grid.offsetY) {
    if (!(grid.translateY % grid.tailleCell < 0 && borne == 0))
      line(
        grid.offsetX,
        grid.offsetY + borne + ((grid.translateY-grid.offsetY) % grid.tailleCell),
        windowWidth/grid.scale,
        grid.offsetY + borne + ((grid.translateY-grid.offsetY) % grid.tailleCell)
      );
    borne+= grid.tailleCell;
  }
  pop();
}
// ---------------------------------------------------------



/**
 * Permet de trouver la position idéal en x et y à partir de la 
 * position de la souris
 * @param {*} offsetX Le décalage en x
 * @param {*} offsetY Le décalage en y
 * @returns Le point le plus proche sur la grille
 */
function findGridLock(offsetX, offsetY) {
  let lockX = round((mouseX/grid.scale - offsetX) / grid.tailleCell) *
    grid.tailleCell;
  let lockY = round((mouseY/grid.scale  - offsetY) / grid.tailleCell) * 
    grid.tailleCell
  return {x:lockX, y: lockY};
}

function isElementDrag(element){
  return drag!=null && drag === element;
}

function isElementSelectionner(element){
  return selection!=null && selection === element;
}

function inGrid(x, y){
  return x > grid.offsetX && y > grid.offsetY
}

// Fonction fil -----------------------------
function validFilBegin(){
let x = mouseX/grid.scale - grid.translateX;
let y = mouseY/grid.scale - grid.translateY;
  if (!inGrid(mouseX/grid.scale, mouseY/grid.scale)){
    return false;
  }
  else if (!((x % (grid.tailleCell*grid.scale) < 20*grid.scale ||
            (x + 20*grid.scale) % (grid.tailleCell*grid.scale) < 20*grid.scale) &&
          (y % (grid.tailleCell*grid.scale) < 20*grid.scale ||
            (y + 20*grid.scale) % (grid.tailleCell*grid.scale) < 20*grid.scale))){
              return false;
            }
    
  else {
    for (const composant of components) {
      if(composant.checkConnection(x, y, 10))
        return true;
    }
    for (const fil of fils) {
      if(fil.yi!=fil.yf && fil.xi!=fil.xf){
        if(dist(fil.xi, fil.yi, x, y)<10 ||
           dist(fil.xf, fil.yf, x, y)<10)
          return true;
      } else {
        let x1 = Math.min(fil.xi-10, fil.xf-10)
        let x2 = Math.max(fil.xi+10, fil.xf+ 10);
        let y1 = Math.min(fil.yi-10, fil.yf-10);
        let y2 = Math.max(fil.yi+10, fil.yf+10);
        if(x > x1 && x < x2 && y > y1 && y < y2)
          return true;
      }
    }
  } 
}

function pente(fil){
  return (fil.yf-fil.yi)/(fil.xf-fil.xi);
}

function filOverlap(fil1,fil2){
  let pente1 = pente(fil1);
  let pente2= pente(fil2);
  //ne marche pas  en diagonal
  if(pente1 === pente2)
    // BUG ce retour est toujours vrai
    return ((fil1.xi - fil2.xi)*(fil1.yi - fil2.yf)) - (fil1.xi - fil2.xf)*(fil1.yi - fil2.yi) == 0 ||
           ((fil1.xf - fil2.xi)*(fil1.yf - fil2.yf)) - (fil1.xf - fil2.xf)*(fil1.yf - fil2.yi) == 0;
  else return false;
}

function simplifyNewFil(testFil){
  if(testFil.xi == testFil.xf &&
    testFil.yi == testFil.yf){
      fils.pop();
      return;
    }
    
  let fils_remplacer =[];
  for (const fil of fils) {
    if(fil!==testFil && filOverlap(testFil,fil)){
      fils_remplacer.push({objet:fil});
    }
  }
  for (let index = 0; index < fils_remplacer.length; index++) {
    let x0 = Math.min(fils_remplacer[index].objet.xi,testFil.xi,fils_remplacer[index].objet.xf,testFil.xf);
    let x1 = Math.max(fils_remplacer[index].objet.xi,testFil.xi,fils_remplacer[index].objet.xf,testFil.xf);
    let y0 = Math.min(fils_remplacer[index].objet.yi,testFil.yi,fils_remplacer[index].objet.yf,testFil.yf);
    let y1 = Math.max(fils_remplacer[index].objet.yi,testFil.yi,fils_remplacer[index].objet.yf,testFil.yf);
    testFil.xi = x0
    testFil.yi = y0;
    testFil.xf = x1
    testFil.yf = y1;
    let i = fils.indexOf(fils_remplacer[index].objet);
    fils_remplacer[index].index = i;
    fils.splice(i,1);
  }
  if(fils_remplacer.length!=0)
    addActions({type:REPLACE,objet:testFil,ancien_objet:fils_remplacer})
  else
    addActions({type:CREATE,objet:testFil})
}

// --------------------------------------

function validComposantPos(composant){
  if (!inGrid(composant.x + grid.translateX, composant.y + grid.translateY))
    return false;
  for (const composantTest of components) {
    if(composantTest.checkConnection(composant.x,composant.y,1))
      return false;
  }
  return true;
}
function simplifyComposant(composant, modif){
  let composant_remplacer;
  for (const composantTest of components) {
    if(composantTest!== composant && composantTest.x == composant.x &&
       composantTest.y == composant.y){
        composant_remplacer = {objet:composantTest};
        break;
    }  
  }
  if(composant_remplacer!=null && modif){
    let action = {type:MODIFIER, objet:composant, changements:[
			{attribut:'x', ancienne_valeur:composant.pastX, nouvelle_valeur:composant.x},
      {attribut:'y', ancienne_valeur:composant.pastY, nouvelle_valeur:composant.y}]};
    let i = components.indexOf(composant_remplacer.objet);
    composant_remplacer.index = i;
    components.splice(i,1);
    addActions([action,{type:REPLACE,objet:composant,ancien_objet:composant_remplacer}])
  }else if(composant_remplacer!=null){
    let i = components.indexOf(composant_remplacer.objet);
    composant_remplacer.index = i;
    components.splice(i,1);
    addActions({type:REPLACE,objet:composant,ancien_objet:composant_remplacer})
  }else{
    addActions( { type: CREATE, objet: composant });
  }
}

function initDrag(element, x, y){
  drag = element;
  selection = element;
  drag.xOffsetDrag = mouseX/grid.scale - x;
  drag.yOffsetDrag = mouseY/grid.scale - y;
}

function createComposant(original){
  // Création d'un nouveau composants selon le composant sélectionner
  let x = original.x/grid.scale - grid.translateX;
  let y = original.y/grid.scale - grid.translateY;
  switch (original.getType()) {
    case 'batterie': return new Batterie(x, y, 0);
    case 'resisteur': return new Resisteur(x, y, 0);
    case 'ampoule': return new Ampoule(x, y, 0);
    case 'condensateur': return new Condensateur(x, y, 0, 'right');
    case 'diode': return new Diode(x, y, 'right');
  }
}

function mousePressed() {
  selection = null;
  // Vérification drag panneau de choix
  for (const element of composants_panneau) {
    if (element.inBounds(mouseX, mouseY, 0, 0)){
      origin = element;
      let new_element = createComposant(element);
      initDrag(new_element, new_element.x+grid.translateX, new_element.y + grid.translateY);
      return;
    }
  } 
  // Vérification drag parmis les composants de la grille
  for (let element of components) {
    if (element.inBounds(mouseX/grid.scale, mouseY/grid.scale, grid.translateX, grid.translateY)) {
      initDrag(element, element.x, element.y);
      drag.pastX = drag.x;
      drag.pastY = drag.y;
      return;
    }
  }
  
  if (validFilBegin()) {
    let point = findGridLock(grid.translateX, grid.translateY)
    drag = {
        xi: point.x,
        yi: point.y,
        xf: point.x,
        yf: point.y,
        getType: function(){return "fil"},
    };
    selection = drag;
    fils.push(drag);
    return;
  }
  if(inGrid(mouseX/grid.scale,mouseY/grid.scale))
    drag = grid;
  
}

function mouseDragged() {
  if(drag != null){
    if (origin != null) {
      //cursor('grabbing');
      let point = findGridLock(drag.xOffsetDrag + grid.translateX,
         drag.yOffsetDrag + grid.translateY);
      drag.x = point.x;
      drag.y = point.y
    } else if(drag === grid){
      //cursor(MOVE);
      grid.translateX += (mouseX - pmouseX)/grid.scale;
      grid.translateY += (mouseY - pmouseY)/grid.scale;
    } else if (drag.getType()=='fil') {
      let point = findGridLock(grid.translateX, grid.translateY);
      drag.xf = point.x;
      drag.yf = point.y;
    } else{
      //cursor('grabbing');
      let point = findGridLock(drag.xOffsetDrag, drag.yOffsetDrag)
      drag.x = point.x;
      drag.y = point.y
    }
    
  }
}

function mouseReleased() {
  // Arrète le drag si il y en avait un en cours
  //cursor(ARROW);
  if (drag != null){
    if(origin !=null) {
      if(validComposantPos(drag)){
        components.push(drag);
        simplifyComposant(drag);
      }
    origin = null;
    } else if(drag===grid){
      // Juste pour empêcher une erreure
    } else if (drag.getType()=='fil') {
      simplifyNewFil(drag);
    } else {
        if(validComposantPos(drag)){
          simplifyComposant(drag, true);
        } else{
          // Annuler le mouvement
          drag.x = drag.pastX;
          drag.y = drag.pastY;
        }
    }
    drag = null;
  }
}

function mouseWheel(event){
  if(event.delta < 0 && grid.scale * 1.1 < 13.5){
    zoom();
  }
  else if(event.delta > 0 && grid.scale * 0.9 > 0.2){
    zoom(true);
  }
}

function zoom(inverse){
  let factor = inverse ? -0.1 : 0.1;
  let pastScale = grid.scale;
  grid.scale = grid.scale * (1+factor);
  grid.translateX = (grid.translateX*pastScale - (mouseX - grid.translateX*pastScale) * factor)/grid.scale;
  grid.translateY = (grid.translateY*pastScale - (mouseY - grid.translateY*pastScale) * factor)/grid.scale;
  grid.offsetX *= pastScale/grid.scale;
  grid.offsetY *= pastScale/grid.scale;
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
      if(selection.getType()!=='fil')
        components.splice(components.indexOf(selection),1);
      else fils.splice(fils.indexOf(selection),1);
      addActions({type:DELETE,objet:selection});
      selection = null;
    }
  } else if(keyCode === 82 || keyCode === 83 || keyCode === 67){
      let newC;
      let point = findGridLock(grid.translateX, grid.translateY)
      let x = point.x;
      let y = point.y;
      if (keyCode === 82) {
        newC = new Resisteur(x, y);
      } else if (keyCode === 83) {
        newC = new Batterie(x, y);
      } else if (keyCode === 67) {
        newC = new Condensateur(x, y);
    }
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

function saveCircuit(){
  //Envoyer à la database
  let error;
  if(error != null){
    //message
  } else{
    //savedCircuit = circuit;
  }
}

function verifierSave(){
  //return saveCircuit == circuit
}

function telecharger(){
  let download = true;
  if(!verifierSave()){
    let response;// = Message de confirmation
    if(response =='save'){
      saveCircuit();
    }else if(response =='annuler'){
      download = false;
    }
  }
  if(download){
    //save(circuit,projet.name + '.json')
  }
}

function cadrerGrille(){
  let xMin = Math.min.apply(Math, components.map(composant => composant.x));
  let xMax = Math.max.apply(Math, components.map(composant => composant.x));
  let yMin = Math.min.apply(Math, components.map(composant => composant.y));
  let yMax = Math.max.apply(Math, components.map(composant => composant.y));
  //let deltaX = xMax - xMin;
  //let deltaY = yMax - yMin;
  grid.translateX = (width - (xMin + xMax) + grid.offsetX)/2;
  grid.translateY = (height - (yMin + yMax) + grid.offsetY)/2;
  // il reste la partie scale si on veut que tout rentre
}
