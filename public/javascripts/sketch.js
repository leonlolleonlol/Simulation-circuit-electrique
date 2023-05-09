let drag; // L'élement qui est déplacer
let selection;
let origin; // variable qui permet de savoir lorsque l'on crée un nouveau élément.
//Lorsque l'on ajoute un composant, le composant sélectionner disparaît dans le sélectionneur
// et pour cela, on doit savoir quel composant panneau de choix est l'origine
let components;// Liste de composants du circuit
let fils;// Liste des fils du circuit

// Variable nécessaire pour placer la grille
let grid;
const composants_panneau = [new Batterie(58, 215, 12),
  new Resisteur(58, 275, 25), new Ampoule(58, 335, 40)]; // Le panneau de choix des composants


// liens vers des éléments DOM utiles
let undo_button;
let redo_button;
let reset_button;
let animation_button;


let percent;
let animate;//bool qui determine si on veut animation ou pas

let c1; //variable contenant l'instance du circuit. Sert pour les calculs

let backgroundColor = 'rgb(200,200,200)';//220

// Initialisation du circuit
function setup() {
  initComponents();
  createCanvas(windowWidth - 50, windowHeight - 30);
  let line_grid_button = select('#line-grid');
  let point_grid_button = select('#point-grid');
  let point_line_grid_button = select('#point-line-grid');
  undo_button = select('#undo');
  redo_button = select('#redo')
  reset_button = select('#reset');
  animation_button= select('#animate');
  //----------------------------------------
  reset_button.mousePressed(refresh);
  undo_button.mousePressed(undo);

  redo_button.mousePressed(redo);
  animation_button.mousePressed(() => {animate=!animate;});
  line_grid_button.mousePressed(()=>{ grid.quadrillage=QUADRILLE;});
  point_grid_button.mousePressed(()=>{ grid.quadrillage=POINT;});
  point_line_grid_button.mousePressed(()=>{ grid.quadrillage=QUADRILLEPOINT;});
  c1 = new Circuit(true);
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
  animate=1;
  fils = [];
  components = [];
  drag = null;
  selection = null;
  origin = null;
  percent=0;
  grid = {
    offsetY: 30,
    tailleCell: 30,
    translateX: 0,
    translateY: 0,
    scale:1,
    quadrillage: POINT,
    getType: function(){return "grille"},
  };
  initPosition();
}
function initPosition(){
  grid.offsetX = round(max(200 * width/1230,138)/grid.tailleCell)*grid.tailleCell / grid.scale;
}

//DOM -------------------------------

/**
 * Met à jour un bouton si la vérification de l'activation 
 * @param {*} button La référence du bouton p5
 * @param {boolean} verification le résultat de la vérification à faire
 */
function validBoutonActif(button, verification) {
  if(verification && button.attribute('disabled')==null){
    button.attribute('disabled', '');
  }
  else if(!verification && button.attribute('disabled')!=null){
    button.removeAttribute('disabled');
  }
}

/**
 * Validation de l'activation d'un bouton
 */
function updateBouton(){
  validBoutonActif(undo_button, undo_list.length == 0);
  validBoutonActif(reset_button, undo_list.length == 0);
  validBoutonActif(redo_button, redo_list.length == 0);
  validBoutonActif(animation_button, components.length==0);
}


// ------------------------------------

/**
 * Effectue les éléments suivant:
 * 1. Changer le background
 * 2. Dessiner la grille
 * 3. Dessiner les fils et composants
 * 4. Dessiner le panneau de choix des composants
 */
function draw() {
  background(backgroundColor);// Mettre le choix de couleur pour le background
  updateBouton();
  scale(grid.scale);
  drawGrid();
  drawFils();
  drawComposants();
  push();
  scale(1/grid.scale);
  drawComponentsChooser();
  pop();
  if (origin != null) {
    drag.draw(grid.translateX, grid.translateY);
  }
}

/**
 * Dessine le menu déroulant pour choisir les composants de l'interface
 */
function drawComponentsChooser() {
  push();
  noStroke();
  textAlign(CENTER);
  fill(backgroundColor);
  rect(0, 0, grid.offsetX * grid.scale, height);
  rect(0, 0, width, grid.offsetY * grid.scale);
  rectMode(CENTER);
  for (const composant of composants_panneau) {
    fill("rgba(128,128,128,0.59)");
    strokeWeight(4);
    stroke("rgba(52,52,52,0.78)");
    rect(composant.x, composant.y + 10, 120, 60);
    if (composant != origin)
      composant.draw(0, 0);
    noStroke();
    fill('black');
    textSize(16);
    textStyle(BOLD)
    text(composant.getTitle(), composant.x,composant.y + 30);
  }
  pop();
}


/**
 * Redirige vers la la fonction pour dessiner la grille dépendant du type de quadrillage sélectionner
 */
function drawGrid(){
  switch (grid.quadrillage) {
    case POINT: 
      drawPointGrid(color('black'));
      break;
    case QUADRILLE:
      drawLineGrid(color('black'));
      break;
    case QUADRILLEPOINT:
      drawLineGrid(color('black'));
      drawPointGrid(color('gray'));
      break;
  }
}


/**
 * Dessine tout les composants de la liste de fils avec p5
 */
function drawFils() {
  percent += 0.01;
  for (let element of fils){
    element.draw(grid.translateX, grid.translateY);
  }
}

/**
 * Dessine tout les composants dans la liste avec p5
 */
function drawComposants(){
  for (let element of components) {
    element.draw(grid.translateX, grid.translateY);
  }
}

/**
 * 
 * @param {Fil} fil Le fil concerner par le calcul
 * @param {number} percent Le pourcentage entre 0 et 1 pour sélectionner la position du fil
 * @returns L'objet contenant la position (x, y)
 */
function posAtPercent(fil, percent) {
  let dx = fil.xf - fil.xi;
  let dy = fil.yf - fil.yi;
  return ({
      x: fil.xi + dx * percent,
      y: fil.yi + dy * percent
  });
}


// GRILLE ------------------------------------------

function drawPointGrid(color) {
  push();
  stroke(color);
  strokeWeight(6);
  let offsetX = grid.offsetX + (grid.translateX-grid.offsetX) % grid.tailleCell;
  let offsetY = grid.offsetY + (grid.translateY-grid.offsetY) % grid.tailleCell;
  for (let i = 0; i < windowWidth/grid.scale + grid.offsetX; i+=grid.tailleCell) {
    for (let j = 0; j < windowHeight/grid.scale + grid.offsetY; j+=grid.tailleCell) {
      point(offsetX + i, offsetY + j);
    }
  }
  pop();
}

function drawLineGrid(color) {
  push();
  stroke(color);
  strokeWeight(2);
  let offsetX = grid.offsetX + (grid.translateX-grid.offsetX) % grid.tailleCell;
  for (let i = 0; i < windowWidth/grid.scale + grid.offsetX; i+=grid.tailleCell) {
    line(offsetX + i, grid.offsetY, offsetX + i , height/grid.scale);
  }
  let offsetY = grid.offsetY + (grid.translateY-grid.offsetY) % grid.tailleCell;
  for (let j = 0; j < windowHeight/grid.scale + grid.offsetY; j+=grid.tailleCell) {
    line(grid.offsetX, offsetY + j, width/grid.scale, offsetY + j);
  }
  pop();
}
// ---------------------------------------------------------



/**
 * Permet de trouver la position idéal en x et y à partir de la 
 * position de la souris
 * @param {number} offsetX Le décalage en x
 * @param {number} offsetY Le décalage en y
 * @returns Le point le plus proche sur la grille
 */
function findGridLock(offsetX, offsetY) {
  let lockX = Math.round((mouseX/grid.scale - offsetX) / grid.tailleCell) *
    grid.tailleCell;
  let lockY = Math.round((mouseY/grid.scale  - offsetY) / grid.tailleCell) * 
    grid.tailleCell
  return {x:lockX, y: lockY};
}

function isElementDrag(element){
  return drag!=null && drag === element;
}

function isElementSelectionner(element){
  return selection!=null && selection === element;
}

/**
 * 
 * @param {number} x la position en y
 * @param {number} y la position en x
 * @returns boolean si notre point se situe dans la grille
 */
function inGrid(x, y){
  return x > grid.offsetX && y > grid.offsetY
}

// Fonction fil -----------------------------
function validFilBegin(x, y){
let point = findGridLock(grid.translateX,grid.translateY)
  if (!inGrid(mouseX/grid.scale, mouseY/grid.scale) || dist(point.x, point.y, x, y)>10){
    return false;
  }
  else {
    return getConnectingComposant(x,y) != null || filStart(x, y)!=null;
  }
}

/**
 * 
 * @param {number} x la position en x
 * @param {number} y la position en y
 * @returns Le composant trouvé ou null
 */
function getConnectingComposant(x, y){
  return components.find(element => element.checkConnection(x, y, 10))
}

/**
 * 
 * @param {number} x la position en x
 * @param {number} y la position en y
 * @returns Le fil trouvé qui connecte ou null
 */
function filStart(x, y){
  for (const fil of fils) {
    if(fil.yi!=fil.yf && fil.xi!=fil.xf){
      if(dist(fil.xi, fil.yi, x, y)<10 ||
         dist(fil.xf, fil.yf, x, y)<10)
        return fil;
    } else if(fil.inBoxBounds(x, y)){
      return fil;
    }
  }
  return null;
}


/**
 * 
 * @param {Fil} fil Le nouveau fil à simplifier
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne effectuer dans la fonction
 */
function simplifyNewFil(fil, actions){
  fil.trierPoint();
  for (let index = 0; index < fils.length; index++) {
    const testFil = fils[index];
    if(testFil!==fil && fil.overlap(testFil)){
      let array = [{x:testFil.xi, y:testFil.yi}, {x:testFil.xf, y:testFil.yf},
        {x:fil.xi, y:fil.yi}, {x:fil.xf, y:fil.yf}];
      if(Math.abs(testFil.pente())==Infinity)
        array.sort(function(a, b){return a.y - b.y});
      else array.sort(function(a, b){return a.x - b.x});
      fil.xi = array[0].x;
      fil.yi = array[0].y;
      fil.xf = array[array.length - 1].x;
      fil.yf = array[array.length - 1].y;
      fils.splice(index, 1);
      actions.push({type:DELETE, objet:testFil, index});
      index--;
    }
  }
  verifierCouperFil(fil,actions);
}

/**
 * 
 * @param {Fil} fil Le fil à vérifier
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne effectuer dans la fonction
 * @returns 
 */
function verifierCouperFil(fil, actions){
  let penteFil = Math.abs(fil.pente());
  if(penteFil==Infinity || penteFil==0){
    for (const composant of components) {
      let continuer = couperFil(fil, composant, actions);
      if(!continuer)
        return;
    }
  }
}

// --------------------------------------

/**
 * 
 * @param {Fil} fil Le fil à valider
 * @param {Composant} composant Le composant à valider
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne effectuer dans la fonction
 * @returns 
 */
function couperFil(fil, composant, actions){
  let penteFil = Math.abs(fil.pente());
  let horizontal = composant.orientation % PI === 0;
  if((penteFil == Infinity && !horizontal) || (penteFil == 0 && horizontal)){
    const index = fils.indexOf(fil);
    let piInBound = composant.inBounds(fil.xi, fil.yi);
    let pfInBound = composant.inBounds(fil.xf, fil.yf);
    let connections = composant.getConnections();
    let borne1 = connections[0];
    let borne2 = connections[1];
    if(piInBound && pfInBound){
      fils.splice(index,1);
      actions.push({type:DELETE,objet:fil, index});
      return false;
    }else if(piInBound && !pfInBound){
      actions.push({type:MODIFIER, objet:fil, changements:[
        {attribut:'xi', ancienne_valeur:fil.xi, nouvelle_valeur:borne2.x},
        {attribut:'yi', ancienne_valeur:fil.yi, nouvelle_valeur:borne2.y}]});
      fil.xi = borne2.x;
      fil.yi = borne2.y;
    }else if(!piInBound && pfInBound){
      actions.push({type:MODIFIER, objet:fil, changements:[
        {attribut:'xf', ancienne_valeur:fil.xf, nouvelle_valeur:borne1.x},
        {attribut:'yf', ancienne_valeur:fil.yf, nouvelle_valeur:borne1.y}]});
      fil.xf = borne1.x;
      fil.yf = borne1.y;
    }else if(fil.inBoxBounds(composant.x,composant.y)){
      let fil1 = new Fil(fil.xi, fil.yi, borne1.x, borne1.y);
      let fil2 = new Fil(borne2.x,borne2.y, fil.xf, fil.yf);
      fils.splice(index,1);
      fils.push(fil1, fil2);
      actions.push({type:DELETE,objet:fil,index},
        {type:CREATE,objet:fil1}, {type:CREATE,objet:fil2});
      verifierCouperFil(fil1, actions);
      verifierCouperFil(fil2, actions);
      return false;
    }
  }
  return true;
}

/**
 * Vérifie si un nouveau composant ou un composant que l'on a modifier a une position valide. Les critères sont que le composant se situe dans la grille
 * 
 * @param {Composant} composant Le composant que l'on veut valider la position
 * @returns Si la position du composant est valide
 */
function validComposantPos(composant){
  if (!inGrid(composant.x + grid.translateX, composant.y + grid.translateY))
    return false;
  return !components.some(element =>element.checkConnection(composant.x,composant.y,1) || composant.checkConnection(element.x,element.y,1));
}

/**
 * 
 * @param {Composant} composant Le nouveau composant à valider
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne effectuer dans la fonction
 */
function simplifyComposant(composant, actions){
  for (let index = 0; index < components.length; index++) {
    const element = components[index];
    if(element!== composant && element.x == composant.x &&
      element.y == composant.y){
        components.splice(index,1);
        actions.push({type:DELETE,objet:element, index});
        break;
    }
  }
  for (const fil of fils) {
    let penteFil = Math.abs(fil.pente());
    if(penteFil==Infinity || penteFil==0)
      couperFil(fil,composant, actions)
  }
}

/**
 * 
 * @param {Composant|Fil} element L'élement que l'on veut drag
 * @param {number} x La position en x relative
 * @param {number} y La position en y relative
 */
function initDrag(element, x, y){
  drag = element;
  selection = element;
  drag.xOffsetDrag = mouseX/grid.scale - x;
  drag.yOffsetDrag = mouseY/grid.scale - y;
}

/**
 * 
 * @param {Composant} original Le composant du menu déroulant que l'on veut copier
 * @returns Le composant copier
 */
function copyComposant(original){
  // Création d'un nouveau composants selon le composant sélectionner
  let x = original.x/grid.scale - grid.translateX;
  let y = original.y/grid.scale - grid.translateY;
  switch (original.getType()) {
    case BATTERIE: return new Batterie(x, y, 0);
    case RESISTEUR: return new Resisteur(x, y, 0);
    case AMPOULE: return new Ampoule(x, y, 0);
    case CONDENSATEUR: return new Condensateur(x, y, 0);
    case DIODE: return new Diode(x, y);
  }
}

function mousePressed() {
  selection = null;
  // Vérification drag panneau de choix
  let x = mouseX/grid.scale - grid.translateX;
  let y = mouseY/grid.scale - grid.translateY;
  for (const element of composants_panneau) {
    if (element.inBounds(mouseX, mouseY, 0, 0)){
      origin = element;
      let new_element = copyComposant(element);
      initDrag(new_element, new_element.x+grid.translateX, new_element.y + grid.translateY);
      return;
    }
  }
  // Vérification drag parmis les composants de la grille
  for (let element of components) {
    if (element.inBounds(x, y)) {
      initDrag(element, element.x, element.y);
      drag.pastPos = {x:drag.x, y:drag.y};
      return;
    }
  }
  if (validFilBegin(x, y)) {
    let point = findGridLock(grid.translateX, grid.translateY);
    drag = new Fil(point.x, point.y, point.x, point.y);
    drag.origin = filStart(x,y);
    selection = drag;
    fils.push(drag);
    return;
  }

  for (const nfil of fils) {
    if(nfil.inBounds(x, y)){
      selection = nfil;
      return;
    }
  }
  if(inGrid(mouseX/grid.scale,mouseY/grid.scale))
    drag = grid;
}

function mouseDragged() {
  if(drag != null){
    if (origin != null) {
      cursor('grabbing');
      let point = findGridLock(drag.xOffsetDrag + grid.translateX,
         drag.yOffsetDrag + grid.translateY);
      drag.x = point.x;
      drag.y = point.y
    } else if(drag === grid){
      cursor(MOVE);
      grid.translateX += (mouseX - pmouseX)/grid.scale;
      grid.translateY += (mouseY - pmouseY)/grid.scale;
    } else if (drag.getType()==FIL) {
      let point = findGridLock(grid.translateX, grid.translateY);
      drag.xf = point.x;
      drag.yf = point.y;
    } else{
      cursor('grabbing');
      let point = findGridLock(drag.xOffsetDrag, drag.yOffsetDrag)
      drag.x = point.x;
      drag.y = point.y
    }
    
  }
}

function mouseReleased() {
  // Arrète le drag si il y en avait un en cours
  if (drag != null){
    cursor(ARROW);
    if(origin !=null) {
      if(validComposantPos(drag)){
        components.push(drag);
        let actions = [{type: CREATE, objet: drag}];
        simplifyComposant(drag, actions);
        addActions(actions);
      }
    origin = null;
    } else if (drag.getType()==FIL) {
      if(drag.longueur()>0){
        let actions = [{type:CREATE, objet:drag}]
        let actionsSup = simplifyNewFil(drag, actions);
        addActions(actions);
      }else {
        let fil = fils.pop();
        if(fil.origin!=null){
          selection = fil.origin;
        }
      }
    } else if(drag instanceof Composant) {
        if(validComposantPos(drag) && dist(drag.pastPos.x, drag.pastPos.y, drag.x, drag.y) > 0){
          let actions = [{type:MODIFIER, objet:drag, changements:[
            	{attribut:'x', ancienne_valeur:drag.pastPos.x, nouvelle_valeur:drag.x},
              {attribut:'y', ancienne_valeur:drag.pastPos.y, nouvelle_valeur:drag.y}]}];
          simplifyComposant(drag, actions);
          addActions(actions);
        } else{
          // Annuler le mouvement
          drag.x = drag.pastPos.x;
          drag.y = drag.pastPos.y;
        }
    }
    drag = null;
  }
}

function mouseWheel(event){
  if(event.delta < 0 && grid.scale * 1.1 < 9){
    zoom(0.1);
  }
  else if(event.delta > 0 && grid.scale * 0.9 > 0.2){
    zoom(-0.1);
  }
}

/**
 * Modifie le zoom qui est appliquer sur notre grille et ces composants
 * @param {number} factor Le facteur de zoom. présentement 0.1 ou -0.1
 */
function zoom(factor){
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
  if (keyIsDown(CONTROL)) {
    if(keyCode === 90){
      keyIsDown(SHIFT)?redo():undo();
      return false;
    }else if(keyCode === 83){
      sauvegarder();
      return false;
    }
  } else {
    if(keyCode === 8 && selection!=null){
      let index;
      if(selection.getType()!==FIL){
        index = components.indexOf(selection)
        components.splice(index, 1);
      } else{
        index = fils.indexOf(selection)
        fils.splice(index, 1);
      } 
      addActions({type:DELETE,objet:selection,index});
      selection = null;
      return false;
    } else if(keyCode === 84 && selection!=null){
      if(selection instanceof Composant){
        let pRotate = selection.orientation;
        selection.rotate(keyIsDown(SHIFT));
        if(validComposantPos(selection)){
          addActions({type:MODIFIER, objet:selection, changements:[
          {attribut:'orientation', ancienne_valeur:pRotate, nouvelle_valeur:selection.orientation}]});
        } else{
          selection.orientation = pRotate;
        }
      }
      return false;
    } else if(keyCode === 82 || keyCode === 83 || keyCode === 65
        /*|| keyCode === 67 || keyCode === 68*/){
      let point = findGridLock(grid.translateX, grid.translateY);
      let newC = function(x, y) {
          switch (keyCode) {
            case 83: return new Batterie(x, y, 0);//s
            case 82: return new Resisteur(x, y, 0);//r
            case 65: return new Ampoule(x, y, 0);//a
            case 67: return new Condensateur(x, y, 0);//c
            case 68 : return new Diode(x, y);//d
          };
        }(point.x,point.y);
      if(validComposantPos(newC)){
        let actions = [{type:CREATE,objet:newC}];
        action = simplifyComposant(newC, actions);
        selection = newC;
        components.push(newC);
        //circuit.ajouterComposante(newC);
        addActions(actions);
      }
      return false;
    }
  }
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
  resetHistorique();
}

/**
 * Cette fonction permet de load un circuit à partir de donnée Json. Cette fonction est très
 * importante puisque certaine donné doivent être résolue (transformé en bon format) comme 
 * le type de l'objet (prototype) qui est très important pour les méthodes et 
 * les id (voir commentaire dans fonction sauvegarder)
 * @param {string} data Les données du circuit en format Json
 */
function load(data){
  let obj = JSON.parse(data);
  components = obj.components;
  fils = obj.fils;
  let map = new Map();
  
  // Réaffecter les méthodes de classe
  for (const composant of components) {
    Object.setPrototypeOf(composant, getPrototype(composant.type));
    map.set(composant.id, composant);
  }
  for (const fil of fils) {
    Object.setPrototypeOf(fil, Fil.prototype);
    map.set(fil.id, fil);
  }

  // Remplacer les id par des objets
  for(const composant of components){
    for (const key in composant) {
      if (Object.hasOwnProperty.call(composant, key)) {
        const value = composant[key];
        if(typeof value == 'object' && value!=null && value.id != null){
          composant[key] = map.get(value.id);
        }
      }
    }
  }
  for(const fil of fils){
    for (const key in fil) {
      if (Object.hasOwnProperty.call(fil, key)) {
        const value = fil[key];
        if(typeof value == 'object' && value!=null && value.id != null){
          fil[key] = map.get(value.id);
        }
      }
    }
  }
}

/**
 * Cette fonction permet de trouver le prototype d'objet correspondant à partir du code de prototype
 * donné par la méthode des classes Composant et Fil getType(). Cette fonction est utile pour réasigner
 * les méthode d'une classe effacé lors du transcrivage en Json
 * @param {string} type Le code de représentation de la classe utiliser (voir méthode getType)
 * @returns Le prototype correspondant au code enregistrer
 */
function getPrototype(type){
  switch (type) {
    case FIL: return Fil.prototype;
    case BATTERIE: return Batterie.prototype;
    case RESISTEUR: return Resisteur.prototype;
    case AMPOULE: return Ampoule.prototype;
    case CONDENSATEUR: return Condensateur.prototype;
    case DIODE: return Diode.prototype;
    default: return Composant.prototype;
  }
}

/**
 * Fonction qui permet d'envoyer une requête au serveur pour enregistrer le circuit.
 * La fonction va automatiquement produire une alerte si une erreur dans quelconque est produite
 */
async function sauvegarder() {
  //Va permettre au décryptement d'affecter nos donné au bon type d'objet
  components.forEach(element => {element.type = element.getType();});
  fils.forEach(element => {element.type = element.getType();});


  informations = {components, fils};
  caches = [];// permet d'enregistrer un objet une fois et d'utiliser des numéros d'identification les autres fois
  let data = JSON.stringify(informations, function(key, value){
    if(value instanceof Composant || value instanceof Fil){
      if(!caches.includes(value)){
        caches.push(value);
        return value;
      }else return {id:value.id}
    }
    return value;
  });
  
  // envoi de la requête
  await fetch('users/sauvegarderCircuit', {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: data,
    }).then(function(response){
      //les actions à faire lorsque notre action réussis
   }).catch(function() {
    alert('Votre sauvegarde a échouer');
  }); 
}

