class Batterie{
    constructor(x, y, width, height){
        this.x=x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag= 0.0;
    }
    isDragged(mouseX, mouseY,offsetX, offsetY){
        return( mouseX - offsetX > this.x - this.width / 2 &&
        mouseX - offsetX < this.x + this.width / 2 &&
        mouseY - offsetY > this.y - this.height / 2 &&
        mouseY - offsetY < this.y + this.height / 2);
        }
    
    getType(){
        return "batterie";
    }
}