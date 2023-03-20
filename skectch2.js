let draggedElement;
let draggedFil;
let origin;
let components;
let fils;
let grid;
let actions;
function setup() {
  actions=[];
  fils=[];
  components=[];
  draggedElement=null;
  draggedFil=null;
  origin=null;
  createCanvas(windowWidth-50, windowHeight-30);
  grid = {
    offsetX: 300,
    offsetY: 20,
    tailleCell: 50,
    translateX: 0,
    translateY: 0,
  };
  resisteur = new Resisteur(58, 60 + 205, 25);
  batterie = new Batterie(58, 315, 100, 30);
  ampoule = new Ampoule(58, 160 + 205, 40);
  components = [];
  fils = [];
}
let batterie;
let resisteur;
let ampoule;

function draw() {
  background(220);
  drawPointGrid();
  point(900,220);
  for (let element of components) {
    element.draw(grid.translateX, grid.translateY);
  }
  drawFils();
  drawComponentsChooser();
  if (origin != null) {
    draggedElement.draw(grid.translateX, grid.translateY);
  }
  let undo_button = createButton('Recommencer');
  undo_button.position(40, 750);
  undo_button.size(120, 50)
  undo_button.mousePressed(refresh);
  let reset_button = createButton('Undo');
  reset_button.position(40, 195);
  reset_button.size(120, 50)
  reset_button.mousePressed(undo);
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
  if (batterie != origin)
    batterie.draw(0, 0);
  if (resisteur != origin)
    resisteur.draw(0, 0);
  if (ampoule != origin)
    ampoule.draw(0, 0);
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
  stroke("orange");
  strokeWeight(4);
  for (let element of fils)
    if (element != null)
      line(element.xi + grid.translateX, element.yi + grid.translateY, element.xf + grid.translateX, element.yf + grid.translateY);
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
  if (batterie.inBounds(mouseX, mouseY, 0, 0)) {
    origin = batterie;
    nelement = new Batterie(batterie.x - grid.translateX, batterie.y - grid.translateY, batterie.width, batterie.height);
    nelement.drag = true;

    nelement.xOffsetDrag = mouseX - batterie.x;
    nelement.yOffsetDrag = mouseY - batterie.y;
    components[components.length] = nelement;
    draggedElement = nelement;
    actions[actions.length]='composante';
  } else if (resisteur.inBounds(mouseX,mouseY,0,0)) {
    origin = resisteur;
    nelement = new Resisteur(resisteur.x - grid.translateX, resisteur.y - grid.translateY, resisteur.taille);
    nelement.drag = true;
    nelement.xOffsetDrag = mouseX - resisteur.x;
    nelement.yOffsetDrag = mouseY - resisteur.y;
    components[components.length] = nelement;
    draggedElement = nelement;
    actions[actions.length]='composante';
  } else if (ampoule.inBounds(mouseX,mouseY,0,0)) {
    origin = ampoule;
    nelement = new Ampoule(ampoule.x - grid.translateX, ampoule.y - grid.translateY, ampoule.taille);
    nelement.drag = true;
    nelement.xOffsetDrag = mouseX - ampoule.x;
    nelement.yOffsetDrag = mouseY - ampoule.y;
    components[components.length] = nelement;
    draggedElement = nelement;
    actions[actions.length]='composante';
  } else {
    for (let element of components) {
      if (element.inBounds(mouseX, mouseY, grid.translateX, grid.translateY)) {
        draggedElement = element;
        draggedElement.drag = true;
        draggedElement.xOffsetDrag = mouseX - draggedElement.x;
        draggedElement.yOffsetDrag = mouseY - draggedElement.y;
        break;
      }
    }//mouseX - offsetX > element.x - 10
    if(mouseX>300)
    {
      if (draggedElement == null)
      {
        if
        (
          (((mouseX - grid.offsetX - grid.translateX) % grid.tailleCell < 20 ||
            (mouseX - grid.offsetX - grid.translateX+20) % grid.tailleCell < 20)) &&
          (((mouseY - grid.offsetY-grid.translateY) % grid.tailleCell < 20 ||
            (mouseY - grid.offsetY-grid.translateY+20) % grid.tailleCell < 20))
        )
        {
          fil = {
            xi: findGridLockX(grid.translateX),
            yi: findGridLockY(grid.translateY),
            xf: findGridLockX(grid.translateX),
            yf: findGridLockY(grid.translateY),
            type: "fil",
          };
          draggedFil = fil;
          fils[fils.length] = fil;
          actions[actions.length]='fil';
        }
      }
    }
  }
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
}

function keyPressed() {
  if (keyIsDown(CONTROL) && keyCode === 90) {
    undo();
  }else if(keyIsDown(CONTROL) && keyIsDown(SHIFT) && keyCode === 80){
    print('parameters')
  }
}


function refresh() {
  setup();
}
function undo() {
    if(actions[actions.length-1]=='fil')
      fils.pop();
    else if(actions[actions.length-1]=='composante')
      components.pop();
    actions.pop();
}