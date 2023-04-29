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
let percent;

let undo_desactive = false;
let c1; //variable contenant l'instance du circuit. Sert pour les calculs

let backgroundColor = 'rgb(200,200,200)';//220

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
  line_grid_button.mousePressed(function(){ grid.quadrillage=QUADRILLE;});
  point_grid_button.mousePressed(function(){ grid.quadrillage=POINT;});
  point_line_grid_button.mousePressed(function(){ grid.quadrillage=QUADRILLEPOINT;});
  c1 = new Circuit(true);

  //-----------------------------------------
  initComponents();
  var sol = nerdamer.solveEquations(['x+y=1', '2*x=6', '4*z+y=6']);
console.log(sol.toString());
  //testSympy();

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
  percent=0;
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
                      new Batterie(58, 265, 12),
                      new Ampoule(58, 315, 40),
                      new Diode(58, 365),
                      new Condensateur(60, 415, 0)];
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
  if (origin != null && origin instanceof Composant && drag instanceof Composant) {
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
  const addition = 0.01;
  let vitesse = 2;
  percent += addition * vitesse;
  let grad=1;
  for (let element of fils){
    if(isElementSelectionner(element) && !isElementSelectionner(drag)){
      push();
      strokeWeight(30);
      stroke('rgba(255, 165, 0, 0.2)');
      let decalageX = 9 * Math.sin(angle(element));
      let decalageY = 9 * Math.cos(angle(element));
      if(element.yi >element.yf){
       decalageX *= -1;
       decalageY *= -1;
      }
      line(element.xi + grid.translateX + decalageX, element.yi + grid.translateY + decalageY, 
           element.xf + grid.translateX - decalageX, element.yf + grid.translateY - decalageY);
      pop();
    }
    fill(0,255*(1-(grad/(fils.length+1))),0);
    stroke(0,255*(1-(grad/(fils.length+1))),0);
    line(element.xi + grid.translateX, element.yi + grid.translateY, element.xf + grid.translateX, element.yf + grid.translateY);
    //temporaire avant d'avoir objet fil
    //stroke('rgba(127, 255, 0, 0.9)');      
    strokeWeight(4);
      line(element.xi + grid.translateX, element.yi + grid.translateY,
           element.xf + grid.translateX, element.yf + grid.translateY);
      let florRes = Math.floor(Math.sqrt(Math.pow(element.xf-element.xi,2)+Math.pow(element.yf-element.yi,2))/30);
      for(let i = 0;i < florRes;i++){
        let percentCharge = (percent*(1+Math.floor(element.courant))/florRes) % 1+ i/florRes;
        percentCharge = percentCharge % 1;
        let pos = getLineXYatPercent(element, percentCharge);
        circle(pos.x,pos.y,10);
      }
      grad++;
  }
  pop();
}
/*
function drawFils() {
  push();
  const addition = 0.01;
  let vitesse = 2;
  percent += addition * vitesse;
  for (let element of fils){
    if (element != null){
      stroke("orange");
      strokeWeight(4);
      line(element.xi + grid.translateX, element.yi + grid.translateY,
           element.xf + grid.translateX, element.yf + grid.translateY);
      fill('red');
      for(let i = 0;i < Math.floor(Math.sqrt(Math.pow(element.xf-element.xi,2)+Math.pow(element.yf-element.yi,2))/30);i++){
        let distance=Math.floor(Math.sqrt(Math.pow(element.xf-element.xi,2)+Math.pow(element.yf-element.yi,2))/30)*30;
        let percentCharge = (30*percent/distance) % 1+ i/distance*30;
        percentCharge = percentCharge % 1;
        let pos = getLineXYatPercent(element, percentCharge);
        circle(pos.x,pos.y,10);
      }
    }
  }
  pop();
}
*/
function getLineXYatPercent(fil, percent) {
  var dx = fil.xf - fil.xi;
  var dy = fil.yf - fil.yi;
  var X = fil.xi+ grid.translateX + dx * percent;
  var Y = fil.yi+ grid.translateY + dy * percent;
  return ({
      x: X,
      y: Y
  });
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
    if(getConnectingComposant(x,y) != null)
      return true;
    else if(filStart(x, y)!=null)
      return true;
    else return false;
  } 
}

function getConnectingComposant(x, y){
  for (const composant of components) {
    if(composant.checkConnection(x, y, 10)){
      return composant;
    }
  }
}

function filStart(x, y){
  for (const fil of fils) {
    if(fil.yi!=fil.yf && fil.xi!=fil.xf){
      if(dist(fil.xi, fil.yi, x, y)<10 ||
         dist(fil.xf, fil.yf, x, y)<10)
        return fil;
    } else if(inBoxBoundFil(fil, x, y)){
      return fil;
    }
  }
}

function inBoxBoundFil(fil, x, y){
  let x1 = Math.min(fil.xi-10, fil.xf-10);
  let x2 = Math.max(fil.xi+10, fil.xf+ 10);
  let y1 = Math.min(fil.yi-10, fil.yf-10);
  let y2 = Math.max(fil.yi+10, fil.yf+10);
  return x > x1 && x < x2 && y > y1 && y < y2;
}

function filInBounds(fil, x, y){
  if(!inBoxBoundFil(fil,x,y)){
    return false;
  }
  let penteF = pente(fil);
  let b = fil.yi - fil.xi * penteF;
  let xTest = (y - b)/penteF;
  let yTest = x * penteF + b;
  return dist(xTest, y, x, y) < 15 || dist(x, yTest, x, y) < 15
}

function pente(fil){
  return (fil.yf-fil.yi)/(fil.xf-fil.xi);
}

function angle(fil){
  return Math.atan(1/pente(fil));
}

function lengthFil(fil){
  return dist(fil.xi, fil.yi, fil.xf, fil.yf);
}

function filOverlap(fil1,fil2){
  let pente1 = pente(fil1);
  let pente2 = pente(fil2);
  let b1 = fil1.yi - fil1.xi * pente1;
  let b2 = fil2.yi - fil2.xi * pente2;
  pente1 = Math.abs(pente1);
  pente2 = Math.abs(pente2);
  if(pente1 === pente2 && Math.abs(b1) === Math.abs(b2)){
    if((pente1 == 0 && fil1.yi===fil2.yi)|| pente1 != 0){
      let x1i = Math.min(fil1.xi,fil1.xf);
      let x1f = Math.max(fil1.xi,fil1.xf);
      let x2i = Math.min(fil2.xi,fil2.xf);
      let x2f = Math.max(fil2.xi,fil2.xf);
      return ((x2i >=x1i && x2i <= x1f) || (x1i >= x2i && x1i <=x2f))
    }else if (pente1 == Infinity && fil1.xi===fil2.xi){
      let y1i = Math.min(fil1.yi,fil1.yf);
      let y1f = Math.max(fil1.yi,fil1.yf);
      let y2i = Math.min(fil2.yi,fil2.yf);
      let y2f = Math.max(fil2.yi,fil2.yf);
      return ((y2i <= y1f && y2i >=y1i) || (y1i <=y2f && y1i >= y2i))
    }
  }
  else return false;
}

function simplifyNewFil(testFil){
  let actions = [];
  let fils_remplacer =[];
  for (const fil of fils) {
    if(fil!==testFil && filOverlap(testFil,fil)){
      fils_remplacer.push({objet:fil});
    }
  }

  if(fils_remplacer.length!=0){
    for (let index = 0; index < fils_remplacer.length; index++) {
      let fil = fils_remplacer[index].objet;
      let penteF = Math.abs(pente(fil));
      if(penteF==Infinity){
        let y0 = Math.min(fil.yi, testFil.yi, fil.yf, testFil.yf);
        let y1 = Math.max(fil.yi, testFil.yi, fil.yf, testFil.yf);
        testFil.yi = y0;
        testFil.yf = y1;
      }else {
        let p1i = {x:fil.xi, y:fil.yi};
        let p1f = {x:fil.xf, y:fil.yf};
        let p2i = {x:testFil.xi, y:testFil.yi};
        let p2f = {x:testFil.xf, y:testFil.yf};
        let array = [p1i, p2i, p1f, p2f];
        array.sort(function(a, b){return a.x - b.x});
        testFil.xi = array[0].x;
        testFil.yi = array[0].y;
        testFil.xf = array[array.length - 1].x;
        testFil.yf = array[array.length - 1].y;
      }
      
    /*for (const composant of components) {
      if(composant.checkConnection(fils_remplacer[index].objet.xi, fils_remplacer[index].objet.yi, 10)){
        fils_remplacer[index].objet.begin = composant;
        break;
      }
    }
    for (const composant of components) {
      if(composant.checkConnection(fils_remplacer[index].objet.xf, fils_remplacer[index].objet.yf, 10)){
        fils_remplacer[index].objet.end = composant;
        break;
      }
    }
    if(fils_remplacer[index].objet.begin!=null && fils_remplacer[index].objet.end){
      circuit.connect(fils_remplacer[index].objet.begin,fils_remplacer[index].objet.end);
    }*/
    
    let i = fils.indexOf(fil);
    fils_remplacer[index].index = i;
    fils.splice(i,1);
    actions.push({type:DELETE, objet:fil, index: i})
    }
  } else{
    /*for (const composant of components) {
      if(composant.checkConnection(testFil.xi, testFil.yi, 10)){
        testFil.begin = composant;
        break;
      }
    }
    for (const composant of components) {
      if(composant.checkConnection(testFil.xf, testFil.yf, 10)){
        testFil.end = composant;
        break;
      }
    }
    if(testFil.begin!=null && testFil.end){
      circuit.connect(testFil.begin,testFil.end);
    }*/
    //addActions({type:CREATE,objet:testFil})
  }
  for (const composant of components) {
    let actionsSup = corrigerConnection(composant, testFil);
    actions = actions.concat(actionsSup);
  }
  return actions; 
}

// --------------------------------------

function validComposantPos(composant){
  if (!inGrid(composant.x + grid.translateX, composant.y + grid.translateY))
    return false;
  for (const composantTest of components) {
    if(composantTest.checkConnection(composant.x,composant.y,1) || composant.checkConnection(composantTest.x,composantTest.y,1))
      return false;
  }
  return true;
}
function simplifyComposant(composant){
  let actions = [];
  for (let index = 0; index < components.length; index++) {
    const element = components[index];
    if(element!== composant && element.x == composant.x &&
      element.y == composant.y){
        components.splice(index,1);
        actions.push({type:DELETE,objet:composantTest, index});
        break;
    }
  }
  for (const fil of fils) {
    let actionsSup = corrigerConnection(composant,fil);
    actions = actions.concat(actionsSup);
  }
  return actions;
}

function corrigerConnection(composant, fil){
  let actions = [];
  const index = fils.indexOf(fil);
  let connections = composant.getConnections();
  let b1 = connections[0];
  let b2 = connections[1];
  let array = [{x:fil.xi, y:fil.yi}, {x:fil.xf, y:fil.yf}];
  array.sort(function(a, b){return a.x - b.x});
  let pi = array[0];
  let pf = array[1];
  let p1Bounds = pi.x > composant.x - 60 / 2 &&
  pi.x < composant.x + 60 / 2 &&
  pi.y > composant.y - 25 / 2 &&
  pi.y < composant.y + 25 / 2;
  let p2Bounds = pf.x > composant.x - 60 / 2 &&
  pf.x < composant.x + 60 / 2 &&
  pf.y > composant.y - 25 / 2 &&
  pf.y < composant.y + 25 / 2;
  if(p1Bounds && p2Bounds){
    fils.splice(index,1);
    actions.push({type:DELETE,objet:fil, index})
  }else if(p1Bounds && !p2Bounds){
    actions.push({type:MODIFIER, objet:fil, changements:[
      {attribut:'xi', ancienne_valeur:fil.xi, nouvelle_valeur:b2.x},
      {attribut:'yi', ancienne_valeur:fil.yi, nouvelle_valeur:b2.y}]});
    fil.xi = b2.x;
    fil.yi = b2.y;
  }else if(!p1Bounds && p2Bounds){
    actions.push({type:MODIFIER, objet:fil, changements:[
      {attribut:'xf', ancienne_valeur:fil.xf, nouvelle_valeur:b1.x},
      {attribut:'yf', ancienne_valeur:fil.yf, nouvelle_valeur:b1.y}]});
    fil.xf = b1.x;
    fil.yf = b1.y;
  }else if(filInBounds(fil, composant.x,composant.y)){
    let fil1 = {
      xi: pi.x,
      yi: pi.y,
      xf: b1.x,
      yf: b1.y,
      courant:Math.random()*10,
      getType: function(){return "fil"},
    };
    let fil2 = {
      xi: b2.x,
      yi: b2.y,
      xf: pf.x,
      yf: pf.y,
      courant:Math.random()*10,
      getType: function(){return "fil"},
    };
    fils.splice(index,1);
    actions.push({type:DELETE,objet:fil,index});
    fils.push(fil1);
    actions.push({type:CREATE,objet:fil1});
    fils.push(fil2);
    actions.push({type:CREATE,objet:fil2});
    // à partir d'ici, faire que les nouveaux fils soit vérifier
  }
  return actions;
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
  let x1 = mouseX/grid.scale - grid.translateX;
  let y1 = mouseY/grid.scale - grid.translateY;
  if (validFilBegin()) {
    let point = findGridLock(grid.translateX, grid.translateY)
    //drag = new Fil(point.x,point.y)
    
    drag = {
        xi: point.x,
        yi: point.y,
        xf: point.x,
        yf: point.y,
        courant:Math.random()*10,
        getType: function(){return "fil"},
    };
    const nfil = filStart(x1,y1);
    if(nfil!=null){
      origin = nfil;
    }
    selection = drag;
    fils.push(drag);
    return;
  }

  for (const nfil of fils) {
    if(filInBounds(nfil, x1, y1)){
      selection = nfil;
      return;
    }
  }
  if(inGrid(mouseX/grid.scale,mouseY/grid.scale))
    drag = grid;
}

function mouseDragged() {
  if(drag != null){
    if (origin != null && origin.getType()!='fil') {
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
    if(origin !=null && origin.getType()!='fil') {
      if(validComposantPos(drag)){
        components.push(drag);
        let action = [{type: CREATE, objet: drag}];
        let actionSup = simplifyComposant(drag);
        addActions(action.concat(actionSup));
        //circuit.ajouterComposante(drag);
      }
    origin = null;
    } else if(drag===grid){
      // Juste pour empêcher une erreure
    } else if (drag.getType()=='fil') {
      if(lengthFil(drag)>0){
        let action = [{type:CREATE, objet:drag}]
        let actionsSup = simplifyNewFil(drag);
        addActions(action.concat(actionsSup));
      }else {
        fils.pop();
        if(origin!=null){
          selection = origin;
          origin = null;
        }
      }
    } else {
        if(validComposantPos(drag) && dist(drag.pastX, drag.pastY, drag.x, drag.y) > 0){
          let action = [{type:MODIFIER, objet:drag, changements:[
            	{attribut:'x', ancienne_valeur:drag.pastX, nouvelle_valeur:drag.x},
              {attribut:'y', ancienne_valeur:drag.pastY, nouvelle_valeur:drag.y}]}];
          let actionSup = simplifyComposant(drag);
          addActions(action.concat(actionSup));
          //circuit.composantPosChange(drag,drag.pastX,drag.pastY);
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
  } else if (keyCode === 8 && selection!=null) {
    let index;
    if(selection.getType()!=='fil'){
      index = components.indexOf(selection)
      components.splice(index, 1);
      //circuit.retirerComposant(selection);
    } else{
      index = fils.indexOf(selection)
      fils.splice(index, 1);
      //circuit.removeConnection(selection)
    } 
    addActions({type:DELETE,objet:selection,index});
    selection = null;
  } else if(!keyIsDown(CONTROL) && keyCode === 84 && selection!=null){
    if(selection instanceof Composant){
      let pRotate = selection.orientation;
      selection.rotate(keyIsDown(SHIFT));
      if(validComposantPos(selection)){
        addActions({type:MODIFIER, objet:selection, changements:[
          {attribut:'orientation', ancienne_valeur:pRotate, nouvelle_valeur:selection.orientation}]});
      }else{
        selection.orientation = pRotate;
      }
    }
  } else if(!keyIsDown(CONTROL) && (keyCode === 82 || keyCode === 83 ||
        keyCode === 67 || keyCode === 65 || keyCode === 68)){
      let newC;
      let point = findGridLock(grid.translateX, grid.translateY);
      let x = point.x;
      let y = point.y;
      if (keyCode === 82) {
        newC = new Resisteur(x, y);
      } else if (keyCode === 83) {
        newC = new Batterie(x, y);
      } else if (keyCode === 65) {
        newC = new Ampoule(x, y);
      } else if (keyCode === 67) {
        newC = new Condensateur(x, y);
      } else if (keyCode === 68) {
        newC = new Diode(x, y);
      }
    if(validComposantPos(newC)){
      action = simplifyComposant(newC);
      selection = newC;
      components.push(newC);
      //circuit.ajouterComposante(newC);
      addActions([{type:CREATE,objet:newC}].concat(action));
    }
    
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