let draggedElement;
let draggedFil;
let origin;
let components;
let fils;
let grid;
let historique;
let distances;
let timers;
let percent;
function setup() {
  createCanvas(windowWidth - 50, windowHeight - 30);
  let undo_button = createButton('Recommencer');
  undo_button.position(40, 750);
  undo_button.size(120, 50);
  undo_button.mousePressed(refresh);
  let reset_button = createButton('Undo');
  reset_button.position(40, 195);
  reset_button.size(120, 50);
  reset_button.mousePressed(undo);
  initComponents();
}
let bat;
let res;
let amp;
let dio;
let condensateur_1;
function initComponents(){
  timers=Array(1000).fill(0);
  percent=0;
  distances=[];
  fils = [];
  components = [];
  draggedElement = null;
  draggedFil = null;
  origin = null;
  historique= new Historique();
  grid = {
    offsetX: 300,
    offsetY: 20,
    tailleCell: 30,
    translateX: 0,
    translateY: 0,
  };
  res = new Resisteur(58, 265, 25);
  bat = new Batterie(58, 315, 60, 30);
  amp = new Ampoule(58, 365, 40);
  dio = new Diode(50, 415, 'right');
  condensateur_1= new Condensateur(60, 465, 'right');
  objects=[res,bat,amp,dio,condensateur_1];
}
function draw() {
  background(220);
  drawPointGrid();
  for (let element of components) {
    element.draw(grid.translateX, grid.translateY);
  }
  drawFils();
  drawComponentsChooser();
  if (origin != null) {
    draggedElement.draw(grid.translateX, grid.translateY);
  }
}

function drawComponentsChooser() {
  noStroke();
  fill(220);
  rect(0, 0, grid.offsetX - 5, windowHeight);
  fill("rgba(128,128,128,0.59)");
  strokeWeight(4);
  stroke("rgba(52,52,52,0.78)");
  for (let i = 0; i < 10; i++) {
    rect(0, 240 + 50 * i, 120, 50);
  }
  for (let element of objects)
    if (element != origin)
      element.draw(0, 0);
}

function drawPointGrid() {
  stroke("black");
  setGrid();
}
function setGrid() {
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
}
function drawPointLineGrid() {
  drawLineGrid();
  stroke("gray");
  setGrid();
}

function drawLineGrid() {
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
}
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

function findGridLockX(offset) {
  return (
    round(
      (mouseX - grid.offsetX - offset) / grid.tailleCell
    ) *
    grid.tailleCell +
    grid.offsetX
  );
}
function findGridLockY(offset) {
  return (
    round((mouseY - grid.offsetY - offset) / grid.tailleCell) * grid.tailleCell +
    grid.offsetY
  );
}

function mousePressed() {
  var nelement;
  if (bat.inBounds(mouseX, mouseY, 0, 0)) {
    origin = bat;
    nelement = new Batterie(bat.x - grid.translateX, bat.y - grid.translateY, bat.width, bat.height);
    setInDrag(nelement,bat.x, bat.y)
    historique.addActions({type:CREATE,objet:nelement});
  } else if (res.inBounds(mouseX, mouseY, 0, 0)) {
    origin = res;
    nelement = new Resisteur(res.x - grid.translateX, res.y - grid.translateY, res.taille);
    setInDrag(nelement,res.x, res.y);
    historique.addActions({type:CREATE,objet:nelement},0);
  } else if (amp.inBounds(mouseX, mouseY, 0, 0)) {
    origin = amp;
    nelement = new Ampoule(amp.x - grid.translateX, amp.y - grid.translateY, amp.taille*1.50);
    setInDrag(nelement,amp.x, amp.y)
    historique.addActions({type:CREATE,objet:nelement});
  } else if (dio.inBounds(mouseX, mouseY, 0, 0)) {
    origin = dio;
    nelement = new Diode(dio.x - grid.translateX, dio.y - grid.translateY, 'right');
    setInDrag(nelement,dio.x, dio.y)
    historique.addActions({type:CREATE,objet:nelement});
  }
  else if (condensateur_1.inBounds(mouseX, mouseY, 0, 0)) {
    origin = condensateur_1;
    nelement = new Condensateur(condensateur_1.x - grid.translateX, condensateur_1.y - grid.translateY, 'right');
    setInDrag(nelement,condensateur_1.x, condensateur_1.y)
    historique.addActions({type:CREATE,objet:nelement});
  } 
  else {
    for (let element of components) {
      if (element.inBounds(mouseX, mouseY, grid.translateX, grid.translateY)) {
        draggedElement = element;
        draggedElement.drag = true;
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
          fil = {
            xi: findGridLockX(grid.translateX),
            yi: findGridLockY(grid.translateY),
            xf: findGridLockX(grid.translateX),
            yf: findGridLockY(grid.translateY),
            type: "fil",
          };
          draggedFil = fil;
          fils[fils.length] = fil;
          historique.addActions({type:CREATE,objet:fil});
        }
      }
    }
  }
}

function setInDrag(element,x,y){  
  element.drag = true;
  element.xOffsetDrag = mouseX - x;
  element.yOffsetDrag = mouseY - y;
  components[components.length] = element;
  draggedElement = element;
}

function mouseDragged() {
  if (draggedElement != null && origin != null) {
    draggedElement.x = findGridLockX(
      draggedElement.xOffsetDrag + grid.translateX
    );
    draggedElement.y = findGridLockY(
      draggedElement.yOffsetDrag + grid.translateY
    );
  }
  else if (draggedElement != null) {
    draggedElement.x = findGridLockX(
      draggedElement.xOffsetDrag
    );
    draggedElement.y = findGridLockY(
      draggedElement.yOffsetDrag
    );
  } else if (draggedFil != null) {
    draggedFil.xf = findGridLockX(grid.translateX);
    draggedFil.yf = findGridLockY(grid.translateY);
  } else if (mouseX > 300) {
    grid.translateX += mouseX - pmouseX;
    grid.translateY += mouseY - pmouseY;
  }
}

function mouseReleased() {
  if (draggedElement != null) {
    draggedElement.drag = false;
    draggedElement = null;
    origin = null;
  } else if (draggedFil != null) {
    draggedFil = null;
  }
  timers=Array(1000).fill(0);
}

function keyPressed() {
  //https://www.toptal.com/developers/keycode
  if (keyIsDown(CONTROL) && keyCode === 90) {
    undo();
  } else if (keyIsDown(CONTROL) && keyIsDown(SHIFT) && keyCode === 80) {
    print('parameters')
  }
}

function refresh() {
  initComponents();
}

function undo() {
  historique.undo();
}