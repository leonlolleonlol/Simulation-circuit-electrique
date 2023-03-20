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
        noStroke();
        fill("#299bf6");
        if (this.drag) circle(this.x + offX, this.y + offY, this.taille + 4);
        else circle(this.x + offX, this.y + offY, this.taille);
        fill("#a358a8");
        if (resisteur.drag)
            triangle(
                this.x - 50 + offX,
                this.y + offY,
                this.x - 16 + offX,
                this.y - 11 + offY,
                this.x - 16 + offX,
                this.y + 11 + offY
            );
        else
            triangle(
                this.x - 50 + offX,
                this.y + offY,
                this.x - 15 + offX,
                this.y - 10 + offY,
                this.x - 15 + offX,
                this.y + 10 + offY
            );
        if (this.drag)
            triangle(
                this.x + 50 + offX,
                this.y + offY,
                this.x + 16 + offX,
                this.y + 11 + offY,
                this.x + 16 + offX,
                this.y - 11 + offY
            );
        else
            triangle(
                this.x + 50 + offX,
                this.y + offY,
                this.x + 15 + offX,
                this.y + 10 + offY,
                this.x + 15 + offX,
                this.y - 10 + offY
            );
    }

    getType() {
        return "resisteur";
    }
}
