let draggedElement = null;
let draggedFil = null;
let origin;
let components;
let fils;
let grid;
function setup() {
  createCanvas(windowWidth-75, windowHeight-40);
  grid = {
    offsetX: 300,
    offsetY: 20,
    tailleCell: 50,
    translateX: 0,
    translateY: 0,
  };
  resisteur = {
    x: 58,
    y: 55,
    taille: 25,
    drag: false,
    isDragged: dragResistor,
    xOffsetDrag: 0.0,
    yOffsetDrag: 0.0,
    type: "resisteur",
  };
  batterie = {
    x: 58,
    y: 110,
    width: 100,
    height: 30,
    drag: false,
    isDragged: dragBatterie,
    xOffsetDrag: 0.0,
    yOffsetDrag: 0.0,
    type: "batterie",
  };

  ampoule = {
    x: 58,
    y: 160,
    taille: 40,
    drag: false,
    isDragged: dragAmpoule,
    xOffsetDrag: 0.0,
    yOffsetDrag: 0.0,
    type: "ampoule",
  };
  components = [];
  fils = [];
}
let batterie;
let resisteur;
let ampoule;

function draw() {
  background(220);
  drawPointGrid();
  for (let element of components) {
    createComponent(element);
  }
  drawFils();
  drawComponentsChooser();
  if (origin != null) {
    createComponent(draggedElement);
  }
}

function drawComponentsChooser() {
  noStroke();
  fill(220);
  rect(0, 0, grid.offsetX - 5, windowHeight);
  fill("rgba(128,128,128,0.59)");
  strokeWeight(4);
  stroke("rgba(52,52,52,0.78)");
  for (let i = 0; i < 3; i++) {
    rect(0, 35 + 50 * i, 120, 50);
  }
  if(batterie!=origin)
  createBatterie(batterie,0,0);
  if(resisteur!=origin)
  createResistor(resisteur,0,0);
  if(ampoule!=origin)
  createAmpoule(ampoule,0,0);
}

function drawPointGrid() {
  stroke("black");
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
  for (let element of fils) {
    line(element.xi + grid.translateX, element.yi + grid.translateY, element.xf + grid.translateX, element.yf + grid.translateY);
  }
}
function createComponent(element) {
  if (element.type == "batterie")
    createBatterie(element, grid.translateX, grid.translateY);
  else if (element.type == "resisteur")
    createResistor(element, grid.translateX, grid.translateY);
  else if (element.type == "ampoule")
    createAmpoule(element, grid.translateX, grid.translateY);
}

function createResistor(resisteur, offX, offY) {
  noStroke();
  fill("#299bf6");
  if (resisteur.drag) circle(resisteur.x + offX, resisteur.y + offY, resisteur.taille + 4);
  else circle(resisteur.x + offX, resisteur.y + offY, resisteur.taille);
  fill("#a358a8");
  if (resisteur.drag)
    triangle(
      resisteur.x - 50 + offX,
      resisteur.y + offY,
      resisteur.x - 16 + offX,
      resisteur.y - 11 + offY,
      resisteur.x - 16 + offX,
      resisteur.y + 11 + offY
    );
  else
    triangle(
      resisteur.x - 50 + offX,
      resisteur.y + offY,
      resisteur.x - 15 + offX,
      resisteur.y - 10 + offY,
      resisteur.x - 15 + offX,
      resisteur.y + 10 + offY
    );
  if (resisteur.drag)
    triangle(
      resisteur.x + 50 + offX,
      resisteur.y + offY,
      resisteur.x + 16 + offX,
      resisteur.y + 11 + offY,
      resisteur.x + 16 + offX,
      resisteur.y - 11 + offY
    );
  else
    triangle(
      resisteur.x + 50 + offX,
      resisteur.y + offY,
      resisteur.x + 15 + offX,
      resisteur.y + 10 + offY,
      resisteur.x + 15 + offX,
      resisteur.y - 10 + offY
    );
}

function createBatterie(batterie, offX, offY) {
  noStroke();
  push();
  let grad = drawingContext.createLinearGradient(
    batterie.x - batterie.width / 2 + offX,
    batterie.y + offY,
    batterie.x + batterie.width / 2 + offX,
    batterie.y + offY
  );
  grad.addColorStop(0, "#e0636c");
  grad.addColorStop(0.35, "#e0636c");
  grad.addColorStop(0.85, "#5771c1");
  grad.addColorStop(1, "#5771c1");
  drawingContext.fillStyle = grad;
  if (batterie.drag)
    rect(
      batterie.x - batterie.width / 2 - 2 + offX,
      batterie.y - batterie.height / 2 - 2 + offY,
      batterie.width + 4,
      batterie.height + 4,
      500
    );
  else
    rect(
      batterie.x - batterie.width / 2 + offX,
      batterie.y - batterie.height / 2 + offY,
      batterie.width,
      batterie.height,
      10
    );
  pop();
}

function createAmpoule(ampoule, offX, offY) {
  noStroke();
  fill("yellow");
  if (ampoule.drag) circle(ampoule.x + offX, ampoule.y + offY, ampoule.taille + 4);
  else circle(ampoule.x + offX, ampoule.y + offY, ampoule.taille);
}

function dragBatterie(element, offsetX, offsetY) {
  return (
    mouseX - offsetX > element.x - element.width / 2 &&
    mouseX - offsetX < element.x + element.width / 2 &&
    mouseY - offsetY > element.y - element.height / 2 &&
    mouseY - offsetY < element.y + element.height / 2
  );
}
function dragAmpoule(element, offsetX, offsetY) {
  if (
    mouseX - offsetX > element.x - element.taille / 2 &&
    mouseX - offsetX< element.x + element.taille / 2 &&
    mouseY - offsetY > element.y - element.taille / 2 &&
    mouseY - offsetY < element.y + element.taille / 2
  )
    return true;
  else return false;
}
function dragResistor(element, offsetX, offsetY) {
  if (
    (mouseX - offsetX > element.x - 40 &&
      mouseX - offsetX < element.x - 15 &&
      mouseY - offsetY > element.y - 10 &&
      mouseY - offsetY < element.y + 10) ||
    (mouseX - offsetX > element.x - element.taille / 2 &&
      mouseX - offsetX < element.x + element.taille / 2 &&
      mouseY - offsetY > element.y - element.taille / 2 &&
      mouseY - offsetY < element.y + element.taille / 2) ||
    (mouseX - offsetX > element.x + 15 &&
      mouseX - offsetX < element.x + 40 &&
      mouseY - offsetY > element.y - 10 &&
      mouseY - offsetY < element.y + 10)
  )
    return true;
  else return false;
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
  if (batterie.isDragged(batterie,0,0)) {
    origin = batterie;
    nelement = {
      x: batterie.x - grid.translateX,
      y: batterie.y - grid.translateY,
      width: batterie.width,
      height: batterie.height,
      drag: true,
      isDragged: dragBatterie,
      xOffsetDrag: mouseX - batterie.x,
      yOffsetDrag: mouseY - batterie.y,
      type: "batterie",
    };
    components[components.length] = nelement;
    draggedElement = nelement;
  } else if (resisteur.isDragged(resisteur,0,0)) {
    origin = resisteur;
    nelement = {
      x: resisteur.x - grid.translateX,
      y: resisteur.y - grid.translateY,
      taille: resisteur.taille,
      drag: true,
      isDragged: dragResistor,
      xOffsetDrag: mouseX - resisteur.x,
      yOffsetDrag: mouseY - resisteur.y,
      type: "resisteur",
    };
    components[components.length] = nelement;
    draggedElement = nelement;
  } else if (ampoule.isDragged(ampoule,0,0)) {
    origin = ampoule;
    nelement = {
      x: ampoule.x - grid.translateX,
      y: ampoule.y - grid.translateY,
      taille: ampoule.taille,
      drag: true,
      isDragged: dragAmpoule,
      xOffsetDrag: mouseX - ampoule.x,
      yOffsetDrag: mouseY - ampoule.y,
      type: "ampoule",
    };
    components[components.length] = nelement;
    draggedElement = nelement;
  } else {
    for (let element of components) {
      if (element.isDragged(element,grid.translateX,grid.translateY)) {
        draggedElement = element;
        draggedElement.drag = true;
        draggedElement.xOffsetDrag = mouseX - draggedElement.x;
        draggedElement.yOffsetDrag = mouseY - draggedElement.y;
        break;
      }
    }//mouseX - offsetX > element.x - 10
    if (draggedElement == null) {
      if (
        (((mouseX - grid.offsetX - grid.translateX) % grid.tailleCell < 15 ||
          (mouseX - grid.offsetX - grid.translateX+20) % grid.tailleCell < 15)) &&
        (((mouseY - grid.offsetY-grid.translateY) % grid.tailleCell < 15 ||
          (mouseY - grid.offsetY-grid.translateY+20) % grid.tailleCell < 15))
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
      }
    }
  }
}

function mouseDragged() {
  if (draggedElement != null && origin!=null ){
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
  } else {
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

