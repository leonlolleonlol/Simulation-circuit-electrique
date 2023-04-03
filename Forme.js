function resisteur(x, y, orientation, drag) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  //transformation
  translate(x, y);
  if (orientation == "vertical")
    rotate(-HALF_PI);
  if(drag)
    scale(1.1);

  let fillGrad = drawingContext.createLinearGradient(-25, -10, 25, 10);
  fillGrad.addColorStop(0, blendBG("rgba(241,39,17,0.6)"));
  fillGrad.addColorStop(1, blendBG("rgba(245,175,25,0.6)"));
  let strokeGrad = drawingContext.createLinearGradient(-25, -10, 25, 10);
  strokeGrad.addColorStop(0, "rgb(241,39,17)");
  strokeGrad.addColorStop(1, "rgb(245,175,25)");

  drawingContext.fillStyle = fillGrad;
  drawingContext.strokeStyle = strokeGrad;

  // Embout du résisteur
  quad(-20, -10, -30, -4, -30, 4, -20, 10);
  quad(20, -10, 30, -4, 30, 4, 20, 10);

  // Centre du résisteur
  rect(0, 0, 50, 25, 10);
  pop();
}

function batterie(x, y, orientation, drag) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  //transformation
  translate(x, y);
  if (this.orientation == "top")
    rotate(-HALF_PI);
  else if (this.orientation == "left")
    rotate(-PI);
  else if (this.orientation == "bottom")
    rotate(HALF_PI);

  if(drag)
    scale(1.1);

  let grad = drawingContext.createLinearGradient(-25, -10, 25, -10);
  grad.addColorStop(0, blendBG("rgba(224,99,108,0.6)"));
  grad.addColorStop(0.35, blendBG("rgba(224,99,108,0.6)"));
  grad.addColorStop(0.85, blendBG("rgba(87,113,193,0.6)"));
  grad.addColorStop(1, blendBG("rgba(87,113,193,0.6)"));
  let grad1 = drawingContext.createLinearGradient(-25, -10, 25, -10);
  grad1.addColorStop(0, "#e0636c");
  grad1.addColorStop(0.35, "#e0636c");
  grad1.addColorStop(0.85, "#5771c1");
  grad1.addColorStop(1, "#5771c1");
  drawingContext.strokeStyle = grad1;
  drawingContext.fillStyle = grad;
  rect(0, 0, 60, 20, 7.5);
  pop();
}
function condensateur(x, y, orientation, drag) {
  push();
  rectMode(CENTER);
  strokeWeight(2);
  //transformation
  translate(x, y);
  if (this.orientation == "vertical")
    rotate(-HALF_PI);
  if(drag)
    scale(1.1);

  let fillGrad = drawingContext.createLinearGradient(-25, -10, 25, 10);
  fillGrad.addColorStop(0, blendBG("rgba(54,209,220,0.6)"));
  fillGrad.addColorStop(0.5, blendBG("rgba(91,134,229,0.6)"));
  fillGrad.addColorStop(1, blendBG("rgba(54,209,220,0.6)"));
  let strokeGrad = drawingContext.createLinearGradient(-25, -10, 25, 10);
  strokeGrad.addColorStop(0, "rgb(54,209,220)");
  strokeGrad.addColorStop(0.5, "rgb(91,134,229)");
  strokeGrad.addColorStop(1, "rgb(54,209,220)");
  drawingContext.fillStyle = fillGrad;
  drawingContext.strokeStyle = strokeGrad;

  const taille = 15;
  rect(-taille + taille / 5, 0, taille, taille * 2, taille / 4);
  rect(taille - taille / 5, 0, taille, taille * 2, taille / 4);
  rect(-2 * taille + taille / 5 + 5 / 2, 0, 10, taille / 2);
  rect(2 * taille - taille / 5 - 5 / 2, 0, 10, taille / 2);
  pop();
}

function diode(x, y, orientation, drag) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  //transformation
  translate(x, y);

  if (this.orientation == "top")
    rotate(-HALF_PI);
  else if (this.orientation == "left")
    rotate(-PI);
  else if (this.orientation == "bottom")
    rotate(HALF_PI);

  if(drag)
    scale(1.1);

  let gradCercle = drawingContext.createLinearGradient(-15, -10, 15, 10);
  gradCercle.addColorStop(1, "rgb(252,70,107)");
  gradCercle.addColorStop(0, "rgb(63,94,251)");
  noFill();
  drawingContext.strokeStyle = gradCercle;
  circle(0, 0, 38);

  // La flèche
  stroke("rgb(32,189,255)");
  fill(blendBG("rgba(32,189,255,0.6)"));
  rect(-4, 0, 22, 8, 10);
  translate(10, 0);
  push();
  rotate(-QUARTER_PI);
  rect(-5, 0, 18, 8, 4);
  pop();
  push();
  rotate(QUARTER_PI);
  rect(-5, 0, 18, 8, 4);
  pop();

  // Enlever certaines bordures de la flèche
  push();
  noStroke();
  rotate(-QUARTER_PI);
  rect(-5, 0, 16, 6, 4);
  pop();
  translate(-10, 0);
  noStroke();
  rect(-4, 0, 20, 6, 10);
  pop();
}
function ampoule(x, y, orientation, drag) {
  push();
  strokeWeight(2);
  rectMode(CENTER);

  //transformation
  translate(x, y);
  if (this.orientation == "vertical")
    rotate(-HALF_PI);
  if(drag)
    scale(1.1);

  let grad = drawingContext.createLinearGradient(-30, -10, -13, -10);
  grad.addColorStop(0, "rgb(142,45,226)");
  grad.addColorStop(1, "rgb(74,0,224)");
  let grad1 = drawingContext.createLinearGradient(-30, -10, -13, -10);
  grad1.addColorStop(0, blendBG("rgba(142,45,226,0.6)"));
  grad1.addColorStop(1, blendBG("rgba(74,0,224,0.6)"));
  drawingContext.strokeStyle = grad;
  drawingContext.fillStyle = grad1;
  rect(-17, 0, 6, 22, 0, 8, 8, 0);
  rect(-25, 0, 10, 7);
  let grad2 = drawingContext.createLinearGradient(30, -10, 13, -10);
  grad2.addColorStop(0, "rgb(142,45,226)");
  grad2.addColorStop(1, "rgb(74,0,224)");
  let grad3 = drawingContext.createLinearGradient(30, -10, 13, -10);
  grad3.addColorStop(0, blendBG("rgba(142,45,226,0.6)"));
  grad3.addColorStop(1, blendBG("rgba(74,0,224,0.6)"));
  drawingContext.strokeStyle = grad2;
  drawingContext.fillStyle = grad3;
  rect(17, 0, 6, 22, 8, 0, 0, 8);
  rect(25, 0, 10, 7);
  noStroke();
  let grad4 = drawingContext.createLinearGradient(-12.5, 0, 12.5, 5);
  grad4.addColorStop(0, "rgb(179,255,171)");
  grad4.addColorStop(1, "rgb(18,255,247)");
  drawingContext.fillStyle = grad4;
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = "rgb(18,255,247)";
  circle(0, 0, 20);
  pop();
}

/**
 * 
 * @param {String} cblend 
 * @returns Color
 */
function blendBG(cblend) {
  colorMode(RGB, 255, 255, 255, 1);
  let c = color(220);
  let c1 = color(cblend);
  let outputRed = red(c1) * alpha(c1) + red(c) * (1.0 - alpha(c1));
  let outputGreen = green(c1) * alpha(c1) + green(c) * (1.0 - alpha(c1));
  let outputBlue = blue(c1) * alpha(c1) + blue(c) * (1.0 - alpha(c1));
  return color(outputRed, outputGreen, outputBlue);
}
