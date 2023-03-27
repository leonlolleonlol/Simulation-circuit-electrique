class Resisteur {
    constructor(x, y, taille) {
        this.x = x;
        this.y = y;
        this.taille = taille;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
        this.xPositions=[];
        this.yPositions=[];
    }


    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - this.taille / 2 &&
            mouseX - offsetX < this.x + this.taille / 2 &&
            mouseY - offsetY > this.y - this.taille / 2 &&
            mouseY - offsetY < this.y + this.taille / 2);
    }

    draw(offX, offY) {
       push();
  translate(this.x + offX, this.y + offY);
  colorMode(RGB, 255, 255, 255, 1);
  rectMode(CENTER);
  strokeWeight(2);
  let grad = drawingContext.createLinearGradient(-25, -10, 25, 10);

  grad.addColorStop(0, blendBG("rgba(241,41,19,0.6)"));
  grad.addColorStop(1, blendBG("rgba(245,175,25,0.6)"));
  drawingContext.fillStyle = grad;
  let grad1 = drawingContext.createLinearGradient(-25, -10, 25, 10);
  grad1.addColorStop(0, "rgb(241,41,19)");
  grad1.addColorStop(1, "rgb(245,175,25)");
  drawingContext.strokeStyle = grad1;
  quad(-20, -10, -30, -4, -30, 4, -20, 10);
  quad(20, -10, 30, -4, 30, 4, 20, 10);
  rect(0, 0, 50, 25, 10);
  pop();
    }

    getType() {
        return "resisteur";
    }
}
function blendBG(cblend) {
    let c = color(220);
    let c1 = color(cblend);
    let outputRed = red(c1) * alpha(c1) + red(c) * (1.0 - alpha(c1));
    let outputGreen = green(c1) * alpha(c1) + green(c) * (1.0 - alpha(c1));
    let outputBlue = blue(c1) * alpha(c1) + blue(c) * (1.0 - alpha(c1));
    return color(outputRed, outputGreen, outputBlue);
}
