class Diode {
  constructor(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.radius = 15;
  }
  inBounds(mouseX, mouseY, offsetX, offsetY) {
    return (mouseX - offsetX > this.x - this.radius / 2 &&
        mouseX - offsetX < this.x + this.radius / 2 &&
        mouseY - offsetY > this.y - this.radius / 2 &&
        mouseY - offsetY < this.y + this.radius / 2);
}
  

  
  
  draw(offX,offY) {
    diode(this.x + offX,this.y + offY,this.orientation, this.drag)
  }
}
