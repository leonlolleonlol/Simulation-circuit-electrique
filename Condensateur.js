class Condensateur {
  constructor(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
  }
  
  // offsetX et offsetY à retirer
  draw(offsetX,offsetY) {
  push();
  translate(this.x + offsetX, this.y + offsetY);
  colorMode(HSB);
  rectMode(CENTER);
  let c = color("gray");
  fill("rgba(126,69,157,0.7)");
  let grad = drawingContext.createLinearGradient(-25, -10, 25, 10);
  //noStroke();
  grad.addColorStop(0, "rgba(54,209,220,0.6)");
  grad.addColorStop(0.5, "rgba(91,134,229,0.6)");
  grad.addColorStop(1, "rgba(54,209,220,0.6)");
  drawingContext.fillStyle = grad;
  let grad1 = drawingContext.createLinearGradient(-25, -10, 25, 10);
  grad1.addColorStop(0, 'rgb(54,209,220)');
  grad1.addColorStop(0.5, 'rgb(91,134,229)');
  grad1.addColorStop(1, 'rgb(54,209,220)');
  drawingContext.strokeStyle = grad1;
  //fill('rgba(218,28,71,0.6)');
  strokeWeight(2);
  //stroke('rgba(126,69,157,0.7)')
  //stroke(31,52,brightness(c)-20);
  //strokeJoin(ROUND);
  //translate(this.x - 25 / 2, this.y -25 * 3 / 2);
  if (this.orientation == "vertical") rotate(-HALF_PI);
  //stroke('rgb(83,76,76)');
  rect(-15 + 15 / 5, 0, 15, 15 * 2, 15 / 4);
  //fill('rgba(33,109,243,0.6)');
  rect(15 - 15 / 5, 0, 15, 15 * 2, 15 / 4);

  //fill("rgba(126,69,157,0.7)");
  //fill("rgba(218,28,71,0.6)");
  //fill('rgba(33,109,243,0.6)');
  //stroke("rgb(218,28,71)")
  rect(-2 * 15 + 15 / 5 + 5 / 2, 0, 10, 15 / 2);
  rect(2 * 15 - 15 / 5 - 5 / 2, 0, 10, 15 / 2);
  pop();

  }
}
