class Resisteur{
    constructor(x, y,taille ){
        this.x = x;
        this.y = y;
        this.taille = taille;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag= 0.0;
    }
    

    isDragged(mouseX, mouseY,offsetX, offsetY){
    return( mouseX - offsetX > this.x - this.taille / 2 &&
    mouseX - offsetX < this.x + this.taille / 2 &&
    mouseY - offsetY > this.y - this.taille / 2 &&
    mouseY - offsetY < this.y + this.taille / 2);
    }

    getType(){
        return "resisteur";
    }
}
  