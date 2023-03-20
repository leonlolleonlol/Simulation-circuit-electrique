class Batterie {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
    }
    isDragged(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - this.width / 2 &&
            mouseX - offsetX < this.x + this.width / 2 &&
            mouseY - offsetY > this.y - this.height / 2 &&
            mouseY - offsetY < this.y + this.height / 2);
    }

    draw(offX, offY) {
        noStroke();
        push();
        let grad = drawingContext.createLinearGradient(
            this.x - this.width / 2 + offX,
            this.y + offY,
            this.x + this.width / 2 + offX,
            this.y + offY
        );
        grad.addColorStop(0, "#e0636c");
        grad.addColorStop(0.35, "#e0636c");
        grad.addColorStop(0.85, "#5771c1");
        grad.addColorStop(1, "#5771c1");
        drawingContext.fillStyle = grad;
        if (this.drag)
            rect(
                this.x - this.width / 2 - 2 + offX,
                this.y - this.height / 2 - 2 + offY,
                this.width + 4,
                this.height + 4,
                10
            );
        else
            rect(
                this.x - this.width / 2 + offX,
                this.y - this.height / 2 + offY,
                this.width,
                this.height,
                10
            );
        pop();
    }

    getType() {
        return "batterie";
    }
}