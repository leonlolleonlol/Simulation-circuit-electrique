class Composant {

  constructor(x, y){
      
	this.x = x;
	this.y = y;
	// on crée automatiquement une classe de tension
    this.courant = 0;
    this.tension = 0;
  }
  // Cette méthode est appelé à chaque fois que l'on
  // veut calculer la tension et la différence de pottentiel d'un 
  // composant. Les information disponible sont la branche (composant) et 
  //si notre composant est en paralèle ou en série
  //calcul(paralele, composant){
  //    throw console.error();//todo préciser l'erreur
  //}
  draw(offX, offY) {
    throw console.error();//todo préciser l'erreur
  }
  getType() {
    throw console.error();//todo préciser l'erreur
  }
} 

class Resisteur extends Composant {
    constructor(x, y, resistance, orientation) {
        super(x, y);
	    this.resistance = resistance;
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
        return Resisteur.getType();
    }
    static getType() {
        return 'resisteur';
    }
}


class Ampoule extends Resisteur {
    constructor(x, y, resistance, orientation) {
        super(x, y, resistance, orientation);
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
        return Ampoule.getType();
    }
    static getType() {
        return 'ampoule';
    }
}

class Condensateur extends Composant {
    constructor(x, y, capacite, orientation) {
      super(x, y);
	  this.capacite = capacite;
      this.charge = 0;
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
    
    getType() {
        return Condensateur.getType();
    }
    static getType() {
        return 'condensateur';
    }
  }

  class Batterie extends Composant {
    constructor(x, y, tension, orientation) {
        super(x, y);
	    this.tension = tension;
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
      return Batterie.getType();
    }
    static getType() {
      return 'batterie';
    }
}

class Diode extends Composant {
    constructor(x, y, orientation) {
      super(x, y);
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
    
    getType() {
        return Diode.getType();
    }
    static getType() {
        return 'diode';
    }
  }

class Noeuds extends Composant {
  constructor(x, y, courant, tension){
    //super(courant, tension);
    super(x, y);
    this.circuitsEnParallele = []; //Array de Circuit qui sont en parallèle

    //C'est variable sont utile pour calculer l'équivalence du noeud
    this.capaciteEQ = 0;
    this.resistanceEQ = 0;
    this.tensionEQ = 0;

    //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
    this.type;
  }
  draw(offsetX,offsetY){

  }

 /**
  * Sert à trouver le circuit équivalent en série
  */
 trouverEq(){
    for (let i = 0; i < circuitsEnParallele.length; i++){ 
      this.circuitsEnParallele[i].trouverEq();
    }

    this.trouverTypeDeCircuit();
    
    switch (this.type){
        case circuitType.seulementR:
          let resistancetemp = 0;
            for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
                resistancetemp += 1 / this.circuit[i].resistanceEQ;
            }
            this.resistanceEQ = 1 / resistanceTemp;
            break;
        case circuitType.seulementC:
            for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
              this.capaciteEQ += this.circuit[i];
            }
            break;
        case circuitType.RC:
            //C'est là que c'est difficile
            break;
    }
  }

  trouverTypeDeCircuit(){
    let circuitR = false;
    let circuitC = false;

    for (let i = 0; i < circuitsEnParallele.length; i++){ 
        switch(this.circuitsEnParallele[i].getType()){
            case circuitType.seulementR:
                circuitR = true;
                break;
            case circuitType.seulementC:
                circuitC = true;
                break;
        }
    }

    if(circuitR && circuitC){
        this.type = circuitType.RC;
    }else if (circuitC){
        this.type = circuitType.seulementC;
    }else{
        this.type = circuitType.seulementR
    }
  }

    getType() {
      return Noeud.getType();
    }
    static getType() {
        return 'noeud';
    }
}
  
