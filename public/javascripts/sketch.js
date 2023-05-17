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
let logout_button;
let animation_button;

let undo_tip;
let redo_tip;
let reset_tip;
let logout_tip;
let animation_tip;

let baseCircuit = 'circuit3';

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
  let telecharger_button = select('#download');
  let upload_button = select('#upload');
  let sauvegarder_button = select('#save');
  undo_button = select('#undo');
  redo_button = select('#redo')
  reset_button = select('#reset');
  logout_button = select('#logout');
  animation_button= select('#animate');
  undo_tip = select('#undo-tip');
  redo_tip = select('#redo-tip');
  reset_tip = select('#reset-tip');
  logout_tip = select('#logout-tip');
  animation_tip = select('#animation-tip');
  let animate_image = select('#animate_image');
  //----------------------------------------
  reset_button.mousePressed(refresh);
  undo_button.mousePressed(undo);
  redo_button.mousePressed(redo);
  animation_button.mousePressed(() => {
    animate=!animate;
    if(animate){
      animate_image.attribute('src','images/icons/square.svg');
      animation_tip.html('Arrêter l\'animation');
    }else{
      animate_image.attribute('src','images/icons/play.svg');
      animation_tip.html('Jouer l\'animation');
    }
  });
  line_grid_button.mousePressed(()=>{ grid.quadrillage=QUADRILLE;});
  point_grid_button.mousePressed(()=>{ grid.quadrillage=POINT;});
  point_line_grid_button.mousePressed(()=>{ grid.quadrillage=QUADRILLEPOINT;});
  telecharger_button.mousePressed(telecharger);
  upload_button.mousePressed(upload);
  sauvegarder_button.mousePressed(sauvegarder);
  setTooltip(line_grid_button,'#line-grid-tip');
  setTooltip(point_grid_button,'#point-grid-tip');
  setTooltip(point_line_grid_button,'#pointLine-grid-tip');
  setTooltip(select('#acceuil'),'#acceuil-tip');
  setTooltip(telecharger_button,'#download-tip');
  setTooltip(upload_button,'#upload-tip');
  setTooltip(sauvegarder_button,'#save-tip');
  setTooltip(undo_button,'#undo-tip');
  setTooltip(redo_button,'#redo-tip');
  setTooltip(reset_button,'#reset-tip');
  setTooltip(animation_button,'#animation-tip');
  setTooltip(logout_button,'#logout-tip');
  c1 = new Circuit(true);

  loadLocalCircuit();
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

function setTooltip(button,tooltipId){
  //http://jsfiddle.net/xaliber/TxxQh/
  let tooltip = select(tooltipId);
  let tooltipTimeout;
  button.mouseOver(function(){
    tooltipTimeout = setTimeout(function(){
      if(button.attribute('disabled')==null)
        tooltip.style('visibility', 'visible');
    }, 1000);
  });
  button.mouseOut(function(){
    clearTimeout(tooltipTimeout);
    tooltip.style('visibility', 'hidden');
  });
}

/**
 * Met à jour un bouton si la vérification de l'activation
 * @param {p5.Element} button La référence du vers le bouton 
 * {@link https://p5js.org/reference/#/p5.Element | p5.Element}
 * @param {boolean} verification le résultat de la vérification à faire
 */
function validBoutonActif(button, verification, tooltip) {
  if(verification && button.attribute('disabled')==null){
    button.attribute('disabled', '');
    tooltip.style('visibility', 'hidden');
  }
  else if(!verification && button.attribute('disabled')!=null){
    button.removeAttribute('disabled');
  }
}

/**
 * Validation de l'activation d'un bouton
 */
function updateBouton(){
  validBoutonActif(undo_button, undo_list.length == 0, undo_tip);
  validBoutonActif(redo_button, redo_list.length == 0, redo_tip);
  validBoutonActif(reset_button, undo_list.length == 0, reset_tip);
  validBoutonActif(animation_button, components.length==0, animation_tip);
}


// ------------------------------------

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
  drawFils();
  drawComposants();
  drawComponentsChooser();
  if (origin != null) {
    drag.draw(grid.translateX, grid.translateY);
  }
}

/**
 * Dessine le menu déroulant pour choisir les composants de l'interface
 */
function drawComponentsChooser() {
  push();
  scale(1/grid.scale);
  text('Temps passé: ' +Math.floor(millis()/60000)+' min '+ Math.round(millis()/1000)%60+' s', 5, 750);
  noStroke();
  textAlign(CENTER);
  fill(backgroundColor);
  // Pour cacher les composants hors de la grille
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
 * Dessine tout les composants de la liste de fils avec p5
 * @see {@link Fil#draw | Fil.prototype.draw()}
 */
function drawFils() {
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
 * Vérifie si la position en x et y se situe dans le spectre visible de la grille.
 * Cette vérification ne prend en compte que le décalage de la grille par rapport au canvas
 * @param {number} x la position en y (doit inclure translateX si nécéssaire)
 * @param {number} y la position en x (doit inclure translateY si nécéssaire)
 * @returns boolean si notre point se situe dans la grille
 */
function inGrid(x, y){
  return x > grid.offsetX && y > grid.offsetY
}

/**
 * Vérifie si un point en x et y connecte au borne d'un composant sur la grille et 
 * retourne ce composant si c'est le cas.
 * @param {number} x la position en x
 * @param {number} y la position en y
 * @returns Le composant trouvé ou null
 */
function getConnectingComposant(x, y){
  return components.find(element => element.checkConnection(x, y, 10))
}

/**
 * Vérifie si un point x et y est valide pour commencer un nouveau fil et
 * retourne ce fil si c'est le cas
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
 * Effectue les ajustements automatique après la création d'un nouveau fil par l'utilisateur.
 * 1. Ordonner les points initiaux et finaux plus petit au plus grand (xi doit être < que xf)
 * 2. Unir certains fils possible en un seul fil
 * 3. Coupe le fil dépendant des composants par lequel il passe
 * @param {Fil} fil Le nouveau fil
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne 
 * effectuer dans la fonction
 */
function ajustementAutomatiqueFil(fil, actions){
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
 * Cette fonction permet de faire les appels pour la fonctions couperFil pour chaque composant.
 * Elle a été créer pour nous permettre d'éviter lorsque l'on créer dans la fonction couperFil
 * un nouveau fil de répasser par la fonction ajustementNouveauFil au complet.
 * @param {Fil} fil Le fil à vérifier
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne 
 * effectuer dans la fonction
 */
function verifierCouperFil(fil, actions){
  let penteFil = Math.abs(fil.pente());
  if(penteFil==Infinity || penteFil==0){
    for (const composant of components) {
      let continuer = couperFil(fil, composant, actions);
      if(!continuer)
        break;
    }
  }
}

/**
 * Fonction permettant d'appliquer la règle qu'un fil doit toujours se connecter à un 
 * autre fil ou au borne d'un composant. Dans cette fonction, on vérifier qu'un composant
 * connecte avec un fil et si c'est le cas, on change si nécéssaire les valeur de positions
 * des bornes du fil pour qu'il connecte au composant ou on le supprime tout simplement
 * @param {Fil} fil Le fil que l'on veut comparer
 * @param {Composant} composant Le composant que l'on veut comparer
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions 
 * interne effectuer dans la fonction
 * @returns Un boolean qui dit si le fil a été supprimer du répertoire. Très important si c'est un
 * nouveau fil (voir verifierCouperFil)
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
      //supprimer le fil
      fils.splice(index,1);
      actions.push({type:DELETE,objet:fil, index});
      return false;
    }else if(piInBound && !pfInBound){
      //Raccourcir le fil pour le point initial
      actions.push({type:MODIFIER, objet:fil, changements:[
        {attribut:'xi', ancienne_valeur:fil.xi, nouvelle_valeur:borne2.x},
        {attribut:'yi', ancienne_valeur:fil.yi, nouvelle_valeur:borne2.y}]});
      fil.xi = borne2.x;
      fil.yi = borne2.y;
    }else if(!piInBound && pfInBound){
      //raccourcir le fil pour le point final
      actions.push({type:MODIFIER, objet:fil, changements:[
        {attribut:'xf', ancienne_valeur:fil.xf, nouvelle_valeur:borne1.x},
        {attribut:'yf', ancienne_valeur:fil.yf, nouvelle_valeur:borne1.y}]});
      fil.xf = borne1.x;
      fil.yf = borne1.y;
    }else if(fil.inBoxBounds(composant.x,composant.y)){
      // couper le fil en deux nouveaux fils
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
 * Cette fonction est l'équivalent de ajustementAutomatiqueFil, mais pour les composants.
 * Les actions qui peuvent être effectuer sont de remplacer un composant si deux composants
 * sont à la même position (remplacer le plus ancien par le nouveau) et de recouper les fils
 * si besoin (voir couperFil)
 * @param {Composant} composant Le nouveau composant à valider
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne 
 * effectuer dans la fonction
 */
function ajustementAutomatiqueComposant(composant, actions){
  let composantSuperpose = components.find(element => element!== composant && 
    element.x == composant.x && element.y == composant.y);
  if(composantSuperpose!=null){
    let index = components.indexOf(composantSuperpose);
    components.splice(index,1);
    actions.push({type:DELETE,objet:composantSuperpose, index});
  }
  for (const fil of fils) {
    let penteFil = Math.abs(fil.pente());
    if(penteFil==Infinity || penteFil==0)
      couperFil(fil,composant, actions)
  }
}

/**
 * Cette fonction utilitaire permet de juste d'initier les principales valeurs 
 * utile lorsque l'on veut déplacer un composant (autre qu'un fil) sur la grille
 * @param {Composant} element L'élement que l'on veut drag
 * @param {number} x La position en x du composant
 * @param {number} y La position en y du composant
 */
function initDrag(element, x, y){
  drag = element;
  selection = element;
  drag.xOffsetDrag = mouseX/grid.scale - x;
  drag.yOffsetDrag = mouseY/grid.scale - y;
}

/**
 * Créer un nouveau composant en prenant pour référence la position et le type 
 * du composant précédent sélectionner dans menu des composants
 * @param {Composant} original Le composant du menu déroulant que l'on veut copier
 * @returns Le composant qui a été copier
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

/**
 * Cette fonction gére les drag des composants grahique et la vérification de sélection d'un fil
 */
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

  // Vérifier possibilité de création d'un nouveau fil
  if (validFilBegin(x, y)) {
    let point = findGridLock(grid.translateX, grid.translateY);
    drag = new Fil(point.x, point.y, point.x, point.y);
    drag.origin = filStart(x,y);
    selection = drag;
    fils.push(drag);
    return;
  }

  // Vérifier sélection d'un fil
  for (const nfil of fils) {
    if(nfil.inBounds(x, y)){
      selection = nfil;
      return;
    }
  }
  // vérification d'un déplacement de la grille
  if(inGrid(mouseX/grid.scale,mouseY/grid.scale))
    drag = grid;
}
function creatNoeud(fil){
  //Pas besoin de cette fonction, les points on déjà été trier
  fil.trierPoint();
  f1 = new Fil(fil.xi, fil.yi,fil.xf,fil.yf);
  // étape 1 : vérifier les deux cas de présence de noeud 
  for (const nfil of fils) {
    if(nfil !== fil){
      if((fil.yi - nfil.yi) * (fil.yi-nfil.yf) <= 0 && (fil.yi !== nfil.yi && nfil.yi !== nfil.yf)){
        f1.UsePrint();
      }
    }
  }
  for(let i = 0; i < fils.length - 1; i++){
      if(fils[i].xi === fils[i+1].xi || fils[i].yi === fils[i+1].yi){
        //if(fil.yi != fils[i].yi && fil.yf != fils[i].yf){
        }
   // }  
  }
}

/**
 * Met à jour les informations des éléments drag sur notre grille
 */
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

/**
 * Cette fonction offerte par p5 permet d'exécuter une action après un click avec la souris.
 * Dans le cadre du projet, c'est utiliser pour arrèter le drag si il y en a un en cours
 * et aussi de faire les modifications et vérfications finales.
 */
function mouseReleased() {
  // Arrète le drag si il y en avait un en cours
  if (drag != null){
    cursor(ARROW);
    if(origin !=null) {
      if(validComposantPos(drag)){
        components.push(drag);
        let actions = [{type: CREATE, objet: drag}];
        ajustementAutomatiqueComposant(drag, actions);
        addActions(actions);
      }
    origin = null;
    } else if (drag.getType()==FIL) {
      if(drag.longueur()>0){
        let actions = [{type:CREATE, objet:drag}]
        ajustementAutomatiqueFil(drag, actions);
        creatNoeud(drag);
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
          ajustementAutomatiqueComposant(drag, actions);
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

/**
 * Cette fonction zoom la grille si certaines conditions sont respecter. Cette fonction est 
 * géré et appelé par p5.
 * @param {*} event l'evenement en liens avec cet appel de fonction
 * @returns false si l'on veut empécher tout comportement par défaut dans le navigateur
 * en lien avec cet évenement
 */
function mouseWheel(event){
  if(inGrid(mouseX/grid.scale, mouseY/grid.scale)){
    if(event.delta < 0 && grid.scale * 1.1 < 9){
      zoom(0.1);
    }
    else if(event.delta > 0 && grid.scale * 0.9 > 0.2){
      zoom(-0.1);
    }
    return false;
  }
}

/**
 * Modifie le zoom qui est appliquer sur notre grille et ces composants
 * @param {number} factor Le facteur de zoom. Ce facteur est soit 0.1 ou -0.1
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
  * 
  * Voici les raccourcis actuel:
  *  - ctrl + Z : annuler
  *  - ctrl + Shift + Z : refaire
  *  - ctrl + S : sauvegarder
  *  - backspace : supprimer sélection
  *  - T : tourner selection de 90 degré
  *  - shift + T : tourner selection de -90 degré
  *  - S : Ajouter batterie
  *  - R : Ajouter résisteur
  *  - A : Ajouter ampoule
  *  - C : Ajouter condensateur (désactiver présentement)
  *  - D : Ajouter diode (désactiver présentement)
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
        action = ajustementAutomatiqueComposant(newC, actions);
        selection = newC;
        components.push(newC);
        //circuit.ajouterComposante(newC);
        addActions(actions);
      }
      return false;
    }
  }
}

/**
 * Lorsque la fenêtre du navigateur est redimensionner, il faut aussi redimensionner le canvas
 * et certaine autres positions
 */
function windowResized(){
  resizeCanvas(windowWidth - 50, windowHeight - 30);
  initPosition();
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


// BackEnd connection

/**
 * Cette fonction permet de load un circuit à partir de donnée Json. Cette fonction est très
 * importante puisque certaine donné doivent être résolue (transformé en bon format) comme 
 * le type de l'objet (prototype) qui est très important pour les méthodes et 
 * les id (voir commentaire dans fonction sauvegarder)
 * @param {object} data Un objet représentant nos données
 */
function load(data){
  let tempElements = data.components.concat(data.fils);
  components.length = fils.length = 0;
  let map = new Map();
  
  // Réaffecter les méthodes de classe
  tempElements.map((element) =>{
    let object = Object.assign(getComposantVide(element.type), element);
    if(object instanceof Composant){
      components.push(object);
    }
    else if(object instanceof Fil){
      fils.push(object)
    }
    map.set(object.id, object);
    return object;
  })

  // Remplacer les id par des objets
  for(const element of tempElements){
    for (const key in element) {
      if (Object.hasOwnProperty.call(element, key)) {
        const value = element[key];
        if(typeof value == 'object' && value!=null && value.id != null){
          element[key] = map.get(value.id);
        }
      }
    }
  }
}

/**
 * Transforme notre circuit en string json. Aussi, remplace les occurences 
 * d'objet répétitive par leurs identifiants
 * @returns {string}
 */
function getStringData(){
  let informations = {components, fils};
  let caches = [];// permet d'enregistrer un objet une fois et d'utiliser des numéros d'identification les autres fois
  return JSON.stringify(informations, function(key, value){
    if(value instanceof Composant || value instanceof Fil){
      if(!caches.includes(value)){
        caches.push(value);
        return value;
      }else return {id:value.id}
    }
    return value;
  });
}

/**
 * Cette fonction permet de produire un nouvel objet correspondant à partir du type de classe
 * donné par la méthode des classes Composant et Fil getType(). Cette fonction est utile pour réasigner
 * les méthode d'une classe effacé lors du transcrivage en Json
 * @param {string} type Le code de représentation de la classe utiliser (voir méthode getType)
 * @returns Un composant graphique vide (sans valeur)
 */
function getComposantVide(type){
  // La fonction pourrait aussi se faire avec Object.create()
  switch (type) {
    case FIL: return new Fil();
    case BATTERIE: return new Batterie();
    case RESISTEUR: return new Resisteur();
    case AMPOULE: return new Ampoule();
    case CONDENSATEUR: return new Condensateur();
    case DIODE: return new Diode();
    default: return new Composant();
  }
}


/**
 * Fonction qui permet d'envoyer une requête au serveur pour enregistrer le circuit.
 * La fonction va automatiquement produire une alerte si une erreur dans quelconque est produite
 */
async function sauvegarder() {
  let data = getStringData();
  // envoi de la requête
  await fetch('/query', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: data,
    }).then(function(response){
      //les actions à faire lorsque notre action réussis
      console.log('JSON data saved successfully');
   }).catch(function() {
    alert('Votre sauvegarde a échouer');
  }); 
}

/**
 * Fait une requête au serveur pour récupérer un des circuits test qui est 
 * enregistrer dans sur le serveur (pas dans la base de donné) et load le circuit
 * @param {string} Le nom du fichier json contenant le circuit demander. Par défaut le circuit de base
 * @see baseCircuit Le nom du circuit à récupérer
 */
async function loadLocalCircuit(circuit = baseCircuit){
  fetch('test/circuit/'+circuit)
    .then((response) => response.json())
    .then((json) => load(json));

}

/**
 * @see https://www.aspsnippets.com/Articles/Download-JSON-object-Array-as-File-from-Browser-using-JavaScript.aspx
 */
function telecharger(){
  let data = [getStringData()];
  const blob = new Blob(data, {type: "application/json"});
  let isIE = false || !!document.documentMode;
  if (isIE) {
    window.navigator.msSaveBlob(blob, "circuit.json");
  } else {
    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = "circuit.json";
    a.href = link;
    a.click();
  }
}

function upload(){
  let input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", function(){
    if(this.files[0]!=null){
      let file = this.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        load(JSON.parse(reader.result));
      };
      reader.readAsText(file);
    }
  }, false);
  input.click();
}
