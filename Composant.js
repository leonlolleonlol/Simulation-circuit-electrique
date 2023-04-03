class Ampoule {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 22 / 2 &&
            mouseY - offsetY < this.y + 22 / 2);
    }

    draw(offX, offY) {
        ampoule(this.x + offX,this.y + offY,this.orientation, this.drag);
    }

    getType() {
        return "ampoule";
    }
}

class Condensateur {
    constructor(x, y, orientation) {
      this.x = x;
      this.y = y;
      this.taille = 50;
      this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
      return (mouseX - offsetX > this.x - 60 / 2 &&
          mouseX - offsetX < this.x + 60 / 2 &&
          mouseY - offsetY > this.y - 30 / 2 &&
          mouseY - offsetY < this.y + 30 / 2);
  }
    
    // offsetX et offsetY à retirer
    draw(offsetX,offsetY) {
      condensateur(this.x + offsetX, this.y + offsetY, this.orientation, this.drag);
    }
  }

  class Batterie {
    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
        this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 30 / 2 &&
            mouseY - offsetY < this.y + 30 / 2);
    }

    draw(offX, offY) {
        batterie(this.x + offX,this.y + offY,this.orientation, this.drag);
    }

    getType() {
        return "batterie";
    }
}

class Diode {
    constructor(x, y, orientation) {
      this.x = x;
      this.y = y;
      this.radius = 19;
      this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
      return (mouseX - offsetX > this.x - this.radius &&
          mouseX - offsetX < this.x + this.radius &&
          mouseY - offsetY > this.y - this.radius &&
          mouseY - offsetY < this.y + this.radius);
  }
    
  
    
    
    draw(offX,offY) {
      diode(this.x + offX,this.y + offY,this.orientation, this.drag);
    }
  }

  class Resisteur {
    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.drag = false;
        this.xOffsetDrag = 0.0;
        this.yOffsetDrag = 0.0;
        this.orientation = orientation;
    }


    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 25 / 2 &&
            mouseY - offsetY < this.y + 25 / 2);
    }

    draw(offX, offY) {
        resisteur(this.x + offX,this.y + offY,this.orientation, this.drag);
    }

    getType() {
        return "resisteur";
    }
}

  