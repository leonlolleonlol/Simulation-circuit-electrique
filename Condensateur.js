class Condensateur {
  constructor(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.taille=50;
    this.orientation = orientation;
  }
  inBounds(mouseX, mouseY, offsetX, offsetY) {
    return (mouseX - offsetX > this.x - this.taille / 2 &&
        mouseX - offsetX < this.x + this.taille / 2 &&
        mouseY - offsetY > this.y - this.taille / 2 &&
        mouseY - offsetY < this.y + this.taille / 2);
}
  
  // offsetX et offsetY à retirer
  draw(offsetX,offsetY) {
    condensateur(this.x + offsetX, this.y + offsetY, this.orientation, this.drag);
  }
}
