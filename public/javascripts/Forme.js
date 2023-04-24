
/**
 * Dessine un résisteur sur le canvas
 * @param {number} x 
 * @param {number} y 
 * @param {number} orientation rotation du composant en radians
 * @param {boolean} drag 
 */
function resisteur(x, y, orientation, selection) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  //transformation
  translate(x, y);
  rotate(orientation);

  if(selection){
    push();
    stroke(blendBG('rgba(255,165,0,0.4)'));
    fill('rgba(255,165,108,0.2)');
    rect(0,0,80,45,10);
    pop();
  }

  // Gradients
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

/**
 * Dessine une batterie sur le canvas
 * @param {number} x 
 * @param {number} y 
 * @param {number} orientation rotation du composant en radians
 * @param {boolean} drag 
 */
function batterie(x, y, orientation, selection) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  //transformation
  translate(x, y);
  rotate(orientation);

  if(selection){
    push();
    stroke(blendBG('rgba(224,99,108,0.4)'));
    fill('rgba(224,99,108,0.2)');
    rect(0,0,80,40,10);
    pop();
  }

  // Gradients
  let fillGrad = drawingContext.createLinearGradient(-25, -10, 25, -10);
  fillGrad.addColorStop(0, blendBG("rgba(224,99,108,0.6)"));
  fillGrad.addColorStop(0.35, blendBG("rgba(224,99,108,0.6)"));
  fillGrad.addColorStop(0.85, blendBG("rgba(87,113,193,0.6)"));
  fillGrad.addColorStop(1, blendBG("rgba(87,113,193,0.6)"));
  let strokeGrad = drawingContext.createLinearGradient(-25, -10, 25, -10);
  strokeGrad.addColorStop(0, "#e0636c");
  strokeGrad.addColorStop(0.35, "#e0636c");
  strokeGrad.addColorStop(0.85, "#5771c1");
  strokeGrad.addColorStop(1, "#5771c1");
  drawingContext.fillStyle = fillGrad;
  drawingContext.strokeStyle = strokeGrad;
  
  rect(0, 0, 60, 20, 7.5);
  pop();
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} orientation rotation du composant en radians
 * @param {boolean} drag 
 */
function condensateur(x, y, orientation, selection) {
  push();
  rectMode(CENTER);
  strokeWeight(2);
  //transformation
  translate(x, y);
  rotate(orientation);

  if(selection){
    push();
    stroke(blendBG('rgba(54,209,220,0.4)'));
    fill('rgba(54,209,220,0.2)');
    rect(0,0,80,50,10);
    pop();
  }

  // Gradients
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

/**
 * Dessine une diode sur le canvas
 * @param {number} x 
 * @param {number} y 
 * @param {number} orientation rotation du composant en radians
 * @param {boolean} drag 
 */
function diode(x, y, orientation, selection) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  //transformation
  translate(x, y);
  rotate(orientation);

  if(selection){
    push();
    stroke(blendBG('rgba(32,189,255,0.4)'));
    fill('rgba(32,189,255,0.2)');
    rect(0,0,50,50,10);
    pop();
  }

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

/**
 * Dessine une ampoule sur le canvas
 * @param {number} x 
 * @param {number} y 
 * @param {number} orientation rotation du composant en radians
 * @param {boolean} drag 
 */
function ampoule(x, y, orientation, selection) {
  push();
  strokeWeight(2);
  rectMode(CENTER);

  //transformation
  translate(x, y);
  rotate(orientation);

  if(selection){
    push();
    stroke(blendBG('rgba(255,255,0,0.4)'));
    fill('rgba(255,255,0,0.2)');
    rect(0,0,80,44,10);
    pop();
  }

  let grad = drawingContext.createLinearGradient(-30, -10, -13, -10);
  grad.addColorStop(0, "rgb(62, 81, 81)");
  grad.addColorStop(1, "rgb(222, 203, 164)");
  let grad1 = drawingContext.createLinearGradient(-30, -10, -13, -10);
  grad1.addColorStop(0, blendBG("rgba(62, 81, 81,0.6)"));
  grad1.addColorStop(1, blendBG("rgba(222, 203, 164,0.6)"));
  drawingContext.strokeStyle = grad;
  drawingContext.fillStyle = grad1;
  rect(-17, 0, 6, 22, 0, 8, 8, 0);
  rect(-25, 0, 10, 7);
  let grad2 = drawingContext.createLinearGradient(30, -10, 13, -10);
  grad2.addColorStop(0, "rgb(62, 81, 81)");
  grad2.addColorStop(1, "rgb(222, 203, 164)");
  let grad3 = drawingContext.createLinearGradient(30, -10, 13, -10);
  grad3.addColorStop(0, blendBG("rgba(62, 81, 81,0.6)"));
  grad3.addColorStop(1, blendBG("rgba(222, 203, 164,0.6)"));
  drawingContext.strokeStyle = grad2;
  drawingContext.fillStyle = grad3;
  rect(17, 0, 6, 22, 8, 0, 0, 8);
  rect(25, 0, 10, 7);
  noStroke();
  let grad4 = drawingContext.createLinearGradient(-12.5, 0, 12.5, 5);
  grad4.addColorStop(0, "#F7971E");
  grad4.addColorStop(1, "#FFD200");
  drawingContext.fillStyle = grad4;
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = "#F7971E";
  circle(0, 0, 20);
  pop();
}

/**
 * Cette fonction permet de mélanger la couleur du background avec la couleur transparente d'un composant
 * sans que la couleur résultante soit transparente. En d'autre mot, enlève le alpha de la couleur
 * @param {String} cblend 
 * @returns La couleur mélanger avec le background
 */
function blendBG(cblend) {
  colorMode(RGB, 255, 255, 255, 1);
  let c = color(backgroundColor);
  let c1 = color(cblend);
  let outputRed = red(c1) * alpha(c1) + red(c) * (1.0 - alpha(c1));
  let outputGreen = green(c1) * alpha(c1) + green(c) * (1.0 - alpha(c1));
  let outputBlue = blue(c1) * alpha(c1) + blue(c) * (1.0 - alpha(c1));
  return color(outputRed, outputGreen, outputBlue);
}
