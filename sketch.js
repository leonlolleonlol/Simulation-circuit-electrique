
let pg;
function setup() {
  // put setup code here
  let resisteur = {x:400, y:100, taille:50};
  let batterie = {x:100-10, y:100 - 20, sec_width:20, sec_height:40}

  array= [resisteur, batterie];
  createCanvas(windowWidth-310, windowHeight-40);
  pg = createGraphics(100,100);

}
let array;

function draw() {
  // put drawing code here
  //background(0);
  createResistor(array[0]);
  createBatterie(array[1]);

  testColor();
  createFils();
  
}

function testColor(){
  let resisteur = {x:600, y:400, taille:50};
  noStroke();
  let grad = drawingContext.createRadialGradient(resisteur.x, resisteur.y, 10, resisteur.x , resisteur.y, 30);
  grad.addColorStop(0,"#bc4e9c");
  grad.addColorStop(1,'#f80759');
  drawingContext.fillStyle = grad;
  circle(resisteur.x, resisteur.y, resisteur.taille);
  fill('#5771c1');
  triangle(resisteur.x - 80, resisteur.y, resisteur.x - 30, resisteur.y - 20, resisteur.x - 30, resisteur.y + 20);
  triangle(resisteur.x + 80, resisteur.y, resisteur.x + 30, resisteur.y + 20, resisteur.x + 30, resisteur.y - 20);
}

function createResistor(resisteur){
  noStroke();
  fill('#299bf6');
  circle(resisteur.x, resisteur.y, resisteur.taille);
  fill('#a358a8');
  triangle(resisteur.x - 80, resisteur.y, resisteur.x - 30, resisteur.y - 20, resisteur.x - 30, resisteur.y + 20);
  triangle(resisteur.x + 80, resisteur.y, resisteur.x + 30, resisteur.y + 20, resisteur.x + 30, resisteur.y - 20);
}

function createFils(){
  noFill();
  stroke('orange');
  strokeWeight(10);
  strokeCap(ROUND);
  line(20, 30, 200, 30);
  bezier(200, 30, 210, 30, 220, 40, 220, 50);
  line(220, 50, 220, 150);

}
//BATTERIE--------------------------------------------------------------

function createBatterie(batterie){

  noStroke();
  let grad = drawingContext.createLinearGradient(batterie.x - batterie.sec_width * 2, batterie.y, batterie.x + batterie.sec_width * 2 , batterie.y);
  grad.addColorStop(0,"#e0636c");
  grad.addColorStop(0.35,"#e0636c");
  grad.addColorStop(0.85,"#5771c1");
  grad.addColorStop(1,'#5771c1');
  drawingContext.fillStyle = grad;
  rect(batterie.x - batterie.sec_width * 2, batterie.y, batterie.sec_width * 5, batterie.sec_height, 16);
}
function createBatterie1(){
  let batterie = {x:100-10, y:160 - 20, sec_width:20, sec_height:40}
  noStroke();
  let grad = drawingContext.createLinearGradient(batterie.x - batterie.sec_width * 2, batterie.y + batterie.sec_height, batterie.x + batterie.sec_width * 2 , batterie.y);
  grad.addColorStop(0,"#e0636c");
  grad.addColorStop(0.2,"#e0636c");
  grad.addColorStop(0.25,"#be6781");
  grad.addColorStop(0.45,"#be6781");
  grad.addColorStop(0.50,"#9c6a96");
  grad.addColorStop(0.70,"#9c6a96");
  grad.addColorStop(0.75,"#7a6dab");
  grad.addColorStop(0.95,"#7a6dab");
  grad.addColorStop(1,'#5771c1');
  drawingContext.fillStyle = grad;
  rect(batterie.x - batterie.sec_width * 2, batterie.y, batterie.sec_width * 5, batterie.sec_height);
  
}

function createBatterie2(){
  let batterie = {x:100-10, y:220 - 20, sec_width:20, sec_height:40}
  noStroke();
  let grad = drawingContext.createLinearGradient(batterie.x - batterie.sec_width * 2, batterie.y, batterie.x + batterie.sec_width * 2 , batterie.y);
  grad.addColorStop(0,"#e0636c");
  grad.addColorStop(1,'#5771c1');
  drawingContext.fillStyle = grad;
  rect(batterie.x - batterie.sec_width * 2, batterie.y, batterie.sec_width * 5, batterie.sec_height);
  
}

function createBatterie3(){
  let batterie = {x:100-10, y:280 - 20, sec_width:20, sec_height:40}
  noStroke();
  fill('#e0636c');
  rect(batterie.x - batterie.sec_width * 2, batterie.y, batterie.sec_width, batterie.sec_height);
  fill('#be6781');
  rect(batterie.x - batterie.sec_width, batterie.y, batterie.sec_width, batterie.sec_height);
  fill('#9c6a96');
  rect(batterie.x, batterie.y, batterie.sec_width, batterie.sec_height);
  fill('#7a6dab');
  rect(batterie.x + batterie.sec_width, batterie.y, batterie.sec_width, batterie.sec_height);
  fill('#5771c1');
  rect(batterie.x + batterie.sec_width * 2, batterie.y, batterie.sec_width, batterie.sec_height);
}