class Composant {

  constructor(x, y){
    this.x = x;
    this.y = y;
    // on crée automatiquement une classe de tension
    this.courant = 0;
    this.tension = 0;
    this.prochaineComposante;
  }
  
  draw(offX, offY) {
    throw console.error();//todo préciser l'erreur
  }
  checkConnection(x, y, approximation){
    if(this.orientation == 'vertical'||this.orientation == 'top'|| this.orientation == 'bottom'){
      return dist(this.x, this.y + 60/2, x, y) < approximation ||
      dist(this.x, this.y - 60/2, x, y) < approximation;
    } else{
      return dist(this.x + 60/2, this.y, x, y)<approximation ||
      dist(this.x - 60/2, this.y, x, y) < approximation;
    }
      
  }

  getMenu(){
    throw console.error();
  }

  getType() {
    throw console.error();//todo préciser l'erreur
  }
  getTypeCalcul() {
    this.getType();
  }
  setProchaineComposante(composante){
    this.prochaineComposante = composante;
  }
  getProchaineComposante(){
    return this.prochaineComposante;
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
        resisteur(this.x + offX,this.y + offY,this.orientation, isElementDrag(this));
    }

    getMenu(){
      return ["DeltaV: " + this.tension, "Courant: " + this.courant, "Résistance: " + this.resistance];
    }
    getEq(sens){
      return (sens?'-':'')+this.resistance+this.symbole;
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
        super(x, y);
        this.resistance = resistance;
        this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 22 / 2 &&
            mouseY - offsetY < this.y + 22 / 2);
    }

    draw(offX, offY) {
        ampoule(this.x + offX,this.y + offY, this.orientation, isElementDrag(this));
    }

    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension, "Courant: " + this.courant, "Résistance: " + this.resistance];
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
      this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
      return (mouseX - offsetX > this.x - 60 / 2 &&
          mouseX - offsetX < this.x + 60 / 2 &&
          mouseY - offsetY > this.y - 30 / 2 &&
          mouseY - offsetY < this.y + 30 / 2);
  }
    
    // offsetX et offsetY à retirer
    draw(offsetX, offsetY) {
      condensateur(this.x + offsetX, this.y + offsetY, this.orientation, isElementDrag(this));
    }

    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension, "Charge: " + this.charge, "Capacité: " + this.capacite];
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
        this.orientation = orientation;
    }
    inBounds(mouseX, mouseY, offsetX, offsetY) {
        return (mouseX - offsetX > this.x - 60 / 2 &&
            mouseX - offsetX < this.x + 60 / 2 &&
            mouseY - offsetY > this.y - 30 / 2 &&
            mouseY - offsetY < this.y + 30 / 2);
    }

    draw(offX, offY) {
        batterie(this.x + offX,this.y + offY, this.orientation, isElementDrag(this));
    }

    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension];
    }
    getEq(sens){
      if(sens){
        if(this.orientation % PI ===0){
          return -this.tension
        }else{
          return this.tension
        }
      }else {
        if(this.orientation % PI ===0){
          return this.tension
        }else{
          return -this.tension
        }
      }
    }

    getType() {
      return Batterie.getType();
    }
    static getType() {
      return 'batterie';
    }

    getTypeCalcul() {
      return composantType.pileType;
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
    
    draw(offX, offY) {
      diode(this.x + offX,this.y + offY, this.orientation, isElementDrag(this));
    }
    
    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "Sens: " + this.orientation];
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

  ajouterComposante(composant){
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
            this.resistanceEQ = (1 / resistanceTemp).round(2);
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

  remplirCondensateursAvecTension(){
    for (let i = 0; i < this.circuitsEnParallele.length; i++){
      this.circuitsEnParallele[i].charge = this.circuitsEnParallele[i].capaciteEQ * this.tensionEQ;
      this.circuitsEnParallele[i].remplirCondensateursAvecCharge();
    }
  }

  /**
   * Continue la maille écrite en séparant la maille pour toute ses branches. Aussi, fait l'inventaire
   * des mailles internes
   * @param {Circuit} composants Liste de composante globale
   * @param {Array} mailles Liste de mailles qui va enregistrer les mailles au fur et à mesure de
   * l'itération dans la branche ou noeud.
   * @param {Array} maille Maille présentement écrite
   * @param {number} index L'index du noeud dans le circuit parent
   */
  maille(composants, mailles, maille, index, inverse){
    for (const element of this.circuitsEnParallele) {
      circuitMaille(element.circuit.concat(composants.slice(index+1)), mailles, 
      [...maille], inverse, -1);
    }
    // Trouver les mailles interne
    for (let i = 0; i < this.circuitsEnParallele.length - 1; i++) {
      const branch = this.circuitsEnParallele[i].circuit;
      for (let j = i + 1; j < this.circuitsEnParallele.length; j++) {
        const reverseBranch = this.circuitsEnParallele[j].circuit.reverse();
        circuitMaille(branch.concat(reverseBranch), mailles, [], !inverse, branch.length );
      }
    }
  }

  getType() {
    return Noeuds.getType();
  }
  static getType() {
      return 'noeud';
  }

  //Ne pas changer cette methode, elle doit être comme ça pour les calculs
  getTypeCalcul() {
    return composantType.noeudType;
  }
  getCircuitNoeud(){
    return this.circuitsEnParallele;
  }
}
  