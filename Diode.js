class Diode {
  constructor(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.radius = 15;
    this.calculatePoints();
  }
  
  calculatePoints(){
    this.coordonneTriangle = [];
    this.trianglePoints = [];
    for (var i = 0; i < 3; i++) {
      // triangle vertices
      var xi = this.radius * cos((i * TWO_PI) / 3.0 - HALF_PI);
      var yi = this.radius * sin((i * TWO_PI) / 3.0 - HALF_PI);
      this.coordonneTriangle[i] = {
        xi,
        yi,
      };
    }
    let currentRadii01 = 0.2;
    var rad = currentRadii01 * this.radius;
    for (var j = 0; j < 3; j++) {
      var px = map(currentRadii01, 0, 1, this.coordonneTriangle[j].xi, 0);
      var py = map(currentRadii01, 0, 1, this.coordonneTriangle[j].yi, 0);

      var ang1 = ((j + 1) * TWO_PI) / 3.0 + HALF_PI;
      var ang2 = ((j + 2) * TWO_PI) / 3.0 + HALF_PI;
      var dang = (ang2 - ang1) / 60.0;
      for (var t = ang1; t <= ang2; t += dang) {
        var ax = px + rad * cos(t);
        var ay = py + rad * sin(t);

        this.trianglePoints.push({x:ax,y:ay});
      }
    }
  }
  
  
  draw(offX,offY) {
    push();
    colorMode(HSB);
    let c = color(31, 52, 97);
    fill(c);
    stroke(31,52,brightness(c)-20);
    strokeWeight(2);
    strokeJoin(ROUND);
    translate(this.x + offX,this.y + offY);
    if (this.orientation == "left") rotate(-HALF_PI);
  else if (this.orientation == "down") rotate(PI);
  else if (this.orientation == "right") rotate(HALF_PI);
    beginShape();
    for (var i = 0; i < this.trianglePoints.length; i++) {
        vertex(this.trianglePoints[i].x, this.trianglePoints[i].y);
    }
    endShape(CLOSE);
    stroke('rgb(83,76,76)');
    strokeWeight(this.radius/4);

    line(
      this.coordonneTriangle[1].xi,
      this.coordonneTriangle[0].yi - this.radius,
      this.coordonneTriangle[2].xi,
      this.coordonneTriangle[0].yi - this.radius
    );
    pop();
  }
}
