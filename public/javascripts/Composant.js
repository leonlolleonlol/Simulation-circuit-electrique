class Composant {

  constructor(x, y){
      
    this.x = x;
    this.y = y;
    // on crée automatiquement une classe de tension
      this.courant = 0;
      this.tension = 0;
  }
  /* ****INUTILE?****
  Cette méthode est appelé à chaque fois que l'on
  veut calculer la tension et la différence de potentiel d'un 
  composant. Les information disponible sont la branche (composant) et 
  si notre composant est en paralèle ou en série
  calcul(paralele, composant){
      throw console.error();//todo préciser l'erreur
  }*/
  draw(offX, offY) {
    throw console.error();//todo préciser l'erreur
  }
  checkConnection(x, y, approximation){
    if(this.orientation % PI == 0){
    return dist(this.x + 60/2, this.y, x, y)<approximation ||
    dist(this.x - 60/2, this.y, x, y) < approximation;
    } else if (this.orientation % HALF_PI == 0){
     return dist(this.x, this.y + 60/2, x, y) < approximation ||
     dist(this.x, this.y - 60/2, x, y) < approximation;
    }
    else return false;
    }

  rotate(inverse){
    this.orientation = (this.orientation + (inverse?-HALF_PI:HALF_PI)) % TWO_PI
  }
  getType() {
    throw console.error();//todo préciser l'erreur
  }
  getTypeCalcul() {
    this.getType();
  }
} 

class Resisteur extends Composant {
    constructor(x, y, resistance, orientation) {
        super(x, y);
	      this.resistance = resistance;
        this.orientation = orientation??0;
    }


    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 25 / 2 &&
            mouseY - offsetY < this.y + 25 / 2);
    }

    draw(offX, offY) {
        resisteur(this.x + offX,this.y + offY,this.orientation, isElementSelectionner(this));
    }

    getType() {
      return Resisteur.getType();
    }
    static getType() {
      return 'resisteur';
    }

    //Ne pas changer cette methode, elle doit être comme ça pour les calculs
    getTypeCalcul() {
      return composantType.resisteurType;
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
        ampoule(this.x + offX,this.y + offY, this.orientation, isElementSelectionner(this));
    }

    getType() {
        return Ampoule.getType();
    }
    static getType() {
        return 'ampoule';
    }

    //Ne pas changer cette methode, elle doit être comme ça pour les calculs
    getTypeCalcul() {
      return composantType.Resisteur;
    }
}

class Condensateur extends Composant {
    constructor(x, y, capacite, orientation) {
      super(x, y);
	    this.capacite = capacite;
      this.charge = 0;
      this.orientation = orientation??0;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
      return (mouseX - offsetX > this.x - 60 / 2 &&
          mouseX - offsetX < this.x + 60 / 2 &&
          mouseY - offsetY > this.y - 30 / 2 &&
          mouseY - offsetY < this.y + 30 / 2);
  }
    
    // offsetX et offsetY à retirer
    draw(offsetX, offsetY) {
      condensateur(this.x + offsetX, this.y + offsetY, this.orientation, isElementSelectionner(this));
    }
    
    getType() {
        return Condensateur.getType();
    }
    static getType() {
        return 'condensateur';
    }
    //Ne pas changer cette methode, elle doit être comme ça pour les calculs
    getTypeCalcul() {
      return composantType.condensateurType;
    }
  }

  class Batterie extends Composant {
    constructor(x, y, tension, orientation) {
        super(x, y);
	      this.tension = tension;
        this.orientation = orientation??0;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 30 / 2 &&
            mouseY - offsetY < this.y + 30 / 2);
    }

    draw(offX, offY) {
        batterie(this.x + offX, this.y + offY, this.orientation, isElementSelectionner(this));
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
      this.orientation = orientation??0;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
      return (mouseX - offsetX > this.x - this.radius &&
          mouseX - offsetX < this.x + this.radius &&
          mouseY - offsetY > this.y - this.radius &&
          mouseY - offsetY < this.y + this.radius);
  }
    
    draw(offX, offY) {
      diode(this.x + offX,this.y + offY, this.orientation, isElementSelectionner(this));
    }
    
    getType() {
        return Diode.getType();
    }
    static getType() {
        return 'diode';
    }

    getTypeCalcul(){
      return composantType.diodeType;
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

    //Indique si le courant à un chemin pour passer dans au moins une des branches
    this.valide = false; //On assume que c'est faux, mais si une des branches est valide, on le met vrai.
  }
  draw(offsetX,offsetY){

  }

  ajouterComposanteALaFin(composant){
    this.circuitsEnParallele.push(composant);
  }

  retirerCircuit(position){
    this.circuitsEnParallele.splice(position, 1);
  }
 /**
  * Sert à trouver le circuit équivalent en série
  */
 trouverEq(){
    for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
      this.circuitsEnParallele[i].trouverEq();
      if(this.circuitsEnParallele[i].valide){
        this.valide = true;
      }
    }

    this.trouverTypeDeCircuit();
    
    switch (this.type){
        case circuitType.seulementR:
          let resistanceTemp = 0;
            for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
              resistanceTemp += 1 / this.circuitsEnParallele[i].resistanceEQ;
            }
            this.resistanceEQ = 1 / resistanceTemp;
            break;
        case circuitType.seulementC:
            for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
              this.capaciteEQ += this.circuitsEnParallele[i].capaciteEQ;
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
    let circuitRC = false;

    for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
        switch(this.circuitsEnParallele[i].getTypeCalcul()){
            case circuitType.seulementR:
              circuitR = true;
              break;
            case circuitType.seulementC:
              circuitC = true;
              break;
            case circuitType.RC:
              circuitRC = true;
              break;
        }
    }

    if((circuitR && circuitC) || circuitRC){
        this.type = circuitType.RC;
    }else if (circuitC){
        this.type = circuitType.seulementC;
    }else{
        this.type = circuitType.seulementR;
    }
  }

  checkConnection(x, y, aproximation){
    return false;
  }

  remplirResisteursAvecDifTension(){
    for (let i = 0; i < this.circuitsEnParallele.length; i++){
      this.circuitsEnParallele[i].courant = this.tensionEQ / this.circuitsEnParallele[i].resistanceEQ;
      this.circuitsEnParallele[i].remplirResisteursAvecCourant();
    }
  }

  getType() {
    return Noeud.getType();
  }
  static getType() {
      return 'noeud';
  }

  //Ne pas changer cette methode, elle doit être comme ça pour les calculs
  getTypeCalcul() {
    return composantType.noeudType;
  }
}
  
