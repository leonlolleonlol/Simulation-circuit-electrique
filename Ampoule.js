class Ampoule {
    constructor(x, y, taille) {
        this.x = x;
        this.y = y;
        this.taille = taille;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - this.taille / 2 &&
            mouseX - offsetX < this.x + this.taille / 2 &&
            mouseY - offsetY > this.y - this.taille / 2 &&
            mouseY - offsetY < this.y + this.taille / 2);
    }

    draw(offX, offY) {
        push();
        noStroke();
        fill("yellow");
        if (this.drag) circle(this.x + offX, this.y + offY, this.taille + 4);
        else circle(this.x + offX, this.y + offY, this.taille);
        pop();
    }

    getType() {
        return "ampoule";
    }
}