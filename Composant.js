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

class Diode {
    constructor(x, y, orientation) {
      this.x = x;
      this.y = y;
      this.radius = 15;
      this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
      return (mouseX - offsetX > this.x - this.radius / 2 &&
          mouseX - offsetX < this.x + this.radius / 2 &&
          mouseY - offsetY > this.y - this.radius / 2 &&
          mouseY - offsetY < this.y + this.radius / 2);
  }
    
  
    
    
    draw(offX,offY) {
      diode(this.x + offX,this.y + offY,this.orientation, this.drag);
    }
  }

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
        resisteur(this.x + offX,this.y + offY,this.orientation, this.drag);
    }

    getType() {
        return "resisteur";
    }
}

  