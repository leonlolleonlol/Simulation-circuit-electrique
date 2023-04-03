class Batterie {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
        this.xPositions=[];
        this.yPositions=[];
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - this.width / 2 &&
            mouseX - offsetX < this.x + this.width / 2 &&
            mouseY - offsetY > this.y - this.height / 2 &&
            mouseY - offsetY < this.y + this.height / 2);
    }

    draw(offX, offY) {
        batterie(this.x + offX,this.y + offY,this.orientation, this.drag);
    }

    getType() {
        return "batterie";
    }
}