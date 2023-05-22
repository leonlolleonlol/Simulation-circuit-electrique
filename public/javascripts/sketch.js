let drag = null; // L'élement qui est déplacer
let draggedAnchor = null;// Les qui s'ont accroché à un composant en mouvement
let selection = null;
let origin = null; // variable qui permet de savoir lorsque l'on crée un nouveau élément.
//Lorsque l'on ajoute un composant, le composant sélectionner disparaît dans le sélectionneur
// et pour cela, on doit savoir quel composant panneau de choix est l'origine
let noeuds;

// Variable nécessaire pour placer la grille
const grid = {
  offsetY: 40,
  tailleCell: 30,
  translateX: 0,
  translateY: 0,
  scale:1,
  quadrillage: POINT,
  getType: ()=> "grille",
};
const composants_panneau = [new Composant(BATTERIE, 58, 215),
  new Composant(RESISTEUR, 58, 275), new Composant(AMPOULE, 58, 335)]; // Le panneau de choix des composants

let baseCircuit = 'circuit3';

let percent;
let animate = true;//bool qui determine si on veut animation ou pas

let c1; //variable contenant l'instance du circuit. Sert pour les calculs

let backgroundColor = 'rgb(200,200,200)';//220
// Initialisation du circuit
function setup() {
  initComponents();
  createCanvas(windowWidth - 50, windowHeight - 30);
  initDom();
  c1 = new Circuit(true);

  let projet = select('#circuit');
  if(projet!=null){
    load(JSON.parse(projet.elt.innerText));
  }else{
    loadLocalCircuit();
    id = Date.now();
  }
  //test();
}

function test(){
  p1 = new Batterie(0, 0, 12);
  r1 = new Resisteur(0, 0, 500)
  
  n1 = new Noeuds();
  
  c2 = new Circuit();
  c3 = new Circuit();

  r2 = new Resisteur(0, 0, 800);
  r3 = new Resisteur(0, 0, 1100);
  r4 = new Resisteur(0, 0, 450); 
  

  r5 = new Resisteur(0, 0, 400);
  r6 = new Resisteur(0, 0, 250);
  r7 = new Resisteur(0, 0, 100);
  c4 = new Circuit();
  c5 = new Circuit();
  n2 = new Noeuds();
  n3 = new Noeuds();
  n4 = new Noeuds();
  /*
  c4.ajouterComposante(r5);
  c4.ajouterComposante(r6);
  c5.ajouterComposante(r7);
  n2.ajouterComposante(c4);
  n2.ajouterComposante(c5);

  c3 = new Circuit(false);
  c3.ajouterComposanteALaFin(new Condensateur(0, 0, 90));
  c3.ajouterComposanteALaFin(n2);
  n1.ajouterComposanteALaFin(c3);
  
  c1.ajouterComposanteALaFin(n1);
  */
  
  /*
  c1.ajouterComposante(n1);
  c1.ajouterComposante(r1);
  c1.ajouterComposante(n2);
  c1.ajouterComposante(r4);
  c1.ajouterComposante(r3);
  */

  c1.ajouterComposante(p1);
  
  c1.connectComposante(p1, n1);
  c1.connectComposante(n1, n2);
  c1.connectComposante(n1, r4);

  c1.connectComposante(n2, r2);
  c1.connectComposante(n2, r1);

  c1.connectComposante(r2, r3);

  c1.connectComposante(r3, n3);
  c1.connectComposante(r1, n3);

  c1.connectComposante(n3, n4);
  c1.connectComposante(r4, n4);

  c1.connectComposante(n4, r5);
  c1.connectComposante(r5, r6);
  c1.connectComposante(r6, p1);
  c1.update();

  print("r1: i = " + r1.courant.round(5) + "A; DeltaV = " + r1.tension.round(2) + "V");
  print("r2: i = " + r2.courant.round(5) + "A; DeltaV = " + r2.tension.round(2) + "V");
  print("r3: i = " + r3.courant.round(5) + "A; DeltaV = " + r3.tension.round(2) + "V");
  print("r4: i = " + r4.courant.round(5) + "A; DeltaV = " + r4.tension.round(2) + "V");
  print("r5: i = " + r5.courant.round(5) + "A; DeltaV = " + r5.tension.round(2) + "V");
  print("r6: i = " + r6.courant.round(5) + "A; DeltaV = " + r6.tension.round(2) + "V");
  print("r7: i = " + r7.courant.round(5) + "A; DeltaV = " + r7.tension.round(2) + "V");
 
  
  //c1.solveCourrantkirchhoff();
}

//Source: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary 
Number.prototype.round = function(places) {
  return +(Math.round(this + "e+" + places)  + "e-" + places);
}

function initComponents(){
  noeuds = [];
  percent=0;
  initPosition();
}
function initPosition(){
  grid.offsetX = round(max(200 * width/1230,138)/grid.tailleCell)*grid.tailleCell / grid.scale;
}

/**
 * Effectue les éléments suivant:
 * 1. Mettre à jour les boutons
 * 2. Dessiner la grille
 * 3. Dessiner les fils et composants
 * 4. Dessiner le panneau de choix des composants
 */
function draw() {
  background(backgroundColor);// Mettre le choix de couleur pour le background
  percent += 0.01;
  updateBouton();
  scale(grid.scale);
  drawGrid();
  drawGridElement();
  drawComponentsChooser();
  if (origin != null) {
    push();
    translate(grid.translateX, grid.translateY);
    drag.draw();
    pop();
  }
}

/**
 * Dessine le menu déroulant pour choisir les composants de l'interface
 */
function drawComponentsChooser() {
  push();
  scale(1/grid.scale);
  noStroke();
  textAlign(CENTER);
  fill(backgroundColor);
  // Pour cacher les composants hors de la grille
  rect(0, 0, grid.offsetX * grid.scale, height);
  rect(0, 0, width, grid.offsetY * grid.scale);
  push();
  stroke('black');
  noFill();
  text('Temps passé: ' +Math.floor(millis()/60000)+' min '+ Math.round(millis()/1000)%60+' s', 70, 500);
  pop();
  rectMode(CENTER);
  for (const composant of composants_panneau) {
    fill("rgba(128,128,128,0.59)");
    strokeWeight(4);
    stroke("rgba(52,52,52,0.78)");
    rect(composant.x, composant.y + 10, 120, 60);
    if (composant != origin)
      composant.draw();
    noStroke();
    fill('black');
    textSize(16);
    textStyle(BOLD)
    text(composant.getTitle(), composant.x,composant.y + 30);
  }
  pop();
}

function drawGridElement(){
  push();
  translate(grid.translateX, grid.translateY);
  fils.forEach(element => element.draw())
  drawAnimationFils();
  components.forEach(element => element.draw());// Dessiner tout les composant
  drawNoeuds();
  pop();
}


/**
 * Redirige vers la la fonction pour dessiner la grille dépendant 
 * du type de quadrillage sélectionner
 * @see {@link pointGrid}
 * @see {@link lineGrid}
 */
function drawGrid(){
  switch (grid.quadrillage) {
    case POINT: 
      pointGrid(color('black'));
      break;
    case QUADRILLE:
      lineGrid(color('black'));
      break;
    case QUADRILLEPOINT:
      lineGrid(color('black'));
      pointGrid(color('gray'));
      break;
  }
}

/**
 * Dessine les animations pour les fils
 */
function drawAnimationFils() {
  if(animate){
    push();
    stroke('orange');
    fill('red')
    strokeWeight(4);
    for (let element of fils){
      let nbCharge = Math.floor(element.longueur()/grid.tailleCell);
      let decalageCharge = (percent*(Math.ceil(element.courant))/nbCharge) % 1;
      if(element.courant!=0){
        for(let i = 0;i < nbCharge;i++){
          let percentCharge = (decalageCharge + i/nbCharge)% 1;
          let pos = posAtPercent(element, percentCharge);
          circle(pos.x,pos.y,10);
        }
      }  
    }
    pop();
  }
}

/**
 * Dessine les noeuds et les connections
 */
function drawNoeuds() {
  updateNoeud();
  push();
  rectMode(CENTER);
  for (let noeud of noeuds) {
    push();
    translate(noeud.x, noeud.y);
    if(noeud.connections.length>2){
      strokeWeight(1.5);
      rotate(PI/4);
      stroke('#8A2387');
      fill('#8A2387');
      square(0, 0, 5.5);
    }else{
      strokeWeight(2);
      stroke('#00308F');
      fill('#007FFF');
      circle(0, 0, 5);
    }
    pop();
  }
  pop();
}

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

/**
 * Vérifie si la position en x et y se situe dans le spectre visible de la grille.
 * Cette vérification ne prend en compte que le décalage de la grille par rapport au canvas
 * @param {number} x la position en y (doit inclure translateX si nécéssaire)
 * @param {number} y la position en x (doit inclure translateY si nécéssaire)
 * @returns {boolean} Le point se situe dans la grille
 */
function inGrid(x, y){
  return x > grid.offsetX && y > grid.offsetY
}

/**
 * Vérification si un élément est déplacer
 * @param {*} element Un élement qui peut être drag
 * @returns boolean si cet élément est présentement déplacé
 */
function isElementDrag(element){
  return drag!=null && drag === element;
}

/**
 * Vérification de la sélection d'un élément
 * @param {*} element Un élement qui peut être sélectionner
 * @returns boolean si cet élément est présentement sélectionner
 */
function isElementSelectionner(element){
  return selection!=null && selection === element;
}

/**
 * Vérifie si un point en x et y connecte au borne d'un composant sur la grille et 
 * retourne ce composant si c'est le cas. On peut spécifier l'option de retourner tout les 
 * composants qui connecte
 * @param {number} x la position en x
 * @param {number} y la position en y
 * @param {boolean} [first] Retourne soit le premier élément trouver, soit tout les éléments
 * @returns Le composant trouvé ou null
 */
function getConnectingComposant(x, y, first=true){
  let isConnecting = element => element.checkConnection(x, y, 10);
  return first ? components.find(isConnecting) : components.filter(isConnecting);
}

/**
 * Vérifie si un point x et y est valide pour commencer un nouveau fil et
 * retourne ce fil si c'est le cas
 * @param {number} x la position en x
 * @param {number} y la position en y
 * @param {boolean} [first] Retourne soit le premier élément trouver, soit tout les éléments
 * @returns Le fil trouvé qui connecte ou null
 */
function filStart(x, y, first = true){
  let connections = [];
  for (const fil of fils) {
    if(!fil.isPenteConstante()){
      if(dist(fil.xi, fil.yi, x, y)<10 ||
         dist(fil.xf, fil.yf, x, y)<10){
        if(!first)
          connections.push(fil);
        else return fil;
      }
    } else if(fil.inBoxBounds(x, y)){
      if(!first)
        connections.push(fil);
      else return fil;
    }
  }
  return !first ? connections : null;
}

/**
 * Permet de récupérer tout les fils et composants dont l'une de leurs bornes 
 * à la même position qu'un coordonné x et y. 
 * **ATTENTION**: Elle inclut aussi la position du composant qui a les coordonés
 * @param {number} x coordoné en x 
 * @param {number} y coordoné en y
 * @param {boolean} first Condition s'y l'on veut que s'arrêter au premier composant trouvé
 * Ce paramètre est seulement important si l'on veut vérifier la précence ou l'absence de connection
 * @returns {Array} Tout les éléments qui sont connecter à cette position. 
 */
function getPossibleConnections(x, y, first = false) {
  return filStart(x, y, first).concat(getConnectingComposant(x, y, first));
}


  /**
   * @typedef {Connection}
   * @property {Array} connections - La liste de tout les composant relier sur une cordonné x et y.
   * @property {number} x - La cordonné en x de la connection
   * @property {number} y - La cordonné en y de la connection.
   */
  
  /**
   * @typedef {ConnectionPair} 
   * @global
   * @property {Connection} left - La connection de gauche du composant.
   * @property {Connection} right - La connection de droite du composant.
   */
  
  
  /**
   * Récupère toute les connections qui sont relier au cordonné d'un composant ou d'un fil.
   * Pour un composant, ce sont par contre les cordonné des bornes qui sont récupérer. En fait,
   * cette méthode est une dérivé de {@link getPossibleConnections} puisqu'elle ne fait qu'assembler
   * les résultats fournis en un seul objet.
   * @param {(Composant|Fil)} element L'élément du circuit que l'on veut récupérer les connections
   * @returns {ConnectionPair} Les connections pour chaqu'une des bornes de l'élément (2 bornes)
   * @see getConnections Pour récupérer position borne
   * @see getPossibleConnections C'est la méthode qui récupère vraiment les connections
   */
  function getAllConnection(element){
    let initial;
    let final;
    if(element instanceof Composant){
      let bornes = element.getConnections();
      initial = bornes[0];
      final = bornes[1];
    }else{
      initial = {x:element.xi, y:element.yi};
      final = {x:element.xf, y:element.yf};
    }
    let connectL = getPossibleConnections(initial.x, initial.y, false);
    let connectR = getPossibleConnections(final.x, final.y, false);
    return {
      left:{connections:connectL, x:initial.x, y:initial.y}, 
      right:{connections:connectR, x:final.x, y:final.y,}
    };
  }

/*
 * Efface tout les composants sur la grille et remet tout les 
 * système à zéro.
 */
function refresh() {
  while(undo_list.length !=0){
    undo()
  } 
  redo_list.length =0;
  drag = null;
  selection = null;
  origin = null;
}