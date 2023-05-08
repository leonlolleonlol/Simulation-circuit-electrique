/**
 * Cette classe est la classe mère de toutes les autres composantes. Elle donne les variables et quelque méthodes
 * importante pour chaque composante.
 */
class Composant {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.courant = 0;
    this.tension = 0;
    this.prochaineComposante = [];
    this.composantePrecedente = [];
    this.dejaPasser = false;
  }
  

  draw(offX, offY) {
    throw "La méthode draw est appelé dans la class mère";//todo préciser l'erreur
  }
  checkConnection(x, y, approximation){
    return this.getBorne(x,y,approximation)!=null;
  }
  getConnections(){
    let pos;
    if(this.orientation % PI == 0){
      pos = [{x:this.x + 60/2, y:this.y},{x:this.x - 60/2, y:this.y}];
      pos.sort(function(a, b){return a.x - b.x});
    } else if (this.orientation % HALF_PI == 0){
      pos = [{x : this.x, y : this.y + 60/2},{x:this.x, y:this.y - 60/2}];
      pos.sort(function(a, b){return a.y - b.y});
    }
    return pos;
  }
  getConnection(borne){
    let connections = this.getConnection();
    return (borne == GAUCHE || borne ==HAUT)
    ? connections[0] : connections[1];
  }
  getBorne(x, y, approximation){
    if(this.orientation % PI == 0){
      if(dist(this.x + 60/2, this.y, x, y) < approximation)
        return DROITE;
      else if (dist(this.x - 60/2, this.y, x, y) < approximation)
        return GAUCHE;
    } else if (this.orientation % HALF_PI == 0){
      if(dist(this.x, this.y + 60/2, x, y) < approximation)
        return BAS;
      else if (dist(this.x, this.y - 60/2, x, y) < approximation)
        return HAUT;
    }
  }

  rotate(inverse){
    this.orientation = (this.orientation + (inverse?-HALF_PI:HALF_PI)) % TWO_PI
  }

  /**
     * Retourne les valeurs importantes à montrer à l'utilisateur dans une array
     * @returns 
     */
  getMenu(){
    throw "getMenu est appelé dans la class mère";
  }

  /**
   * Retourne le type de la composante
   */
  getType() {
    throw "getType est appelé dans la class mère";
  }
  /**
   * Donne à prochaineComposante la valeur passée en paramètre
   * @param {*} composante 
   */
  setProchaineComposante(composante){
    this.prochaineComposante = composante;
  }

  /**
   * Retourne la valeur de la prochaine composante à la position 0 de l'array prochaineComposante.
   * @returns 
   */
  getProchaineComposante(){
    return this.prochaineComposante[0];
  }
} 

/**
 * La class contient la valeur de résistance de cette composante. Elle est passée dans le constructeur pour le moment, donc
 * l'utilisateur ne peut pas choisir la résistance pour le moment.
 */
class Resisteur extends Composant {
    constructor(x, y, resistance, orientation) {
        super(x, y);
	      this.resistance = resistance;
        this.orientation = orientation??0;
    }

    inBounds(x, y) {
      if(this.orientation % PI === 0)
        return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
            y >= this.y - 25 / 2 && y <= this.y + 25 / 2;
      else
        return x >= this.x - 25 / 2 && x <= this.x + 25 / 2 &&
            y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
    }

    draw(offX, offY) {
        resisteur(this.x + offX,this.y + offY,this.orientation, isElementSelectionner(this));
    }

    getMenu(){
      return ["DeltaV: " + this.tension, "Courant: " + this.courant, "Résistance: " + this.resistance];
    }
    getEq(sens){
      return (sens?'-':'')+this.resistance+this.symbole;
    }

    getType() {
      return RESISTEUR;
    }
}


class Ampoule extends Resisteur {
    constructor(x, y, resistance, orientation) {
        super(x, y);
        this.resistance = resistance;
        this.orientation = orientation;
    }
    inBounds(x, y) {
      if(this.orientation % PI === 0)
        return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
            y >= this.y - 22 / 2 && y <= this.y + 22 / 2;
      else
        return x >= this.x - 22 / 2 && x <= this.x + 22 / 2 &&
            y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
    }

    draw(offX, offY) {
        ampoule(this.x + offX,this.y + offY, this.orientation, isElementDrag(this));
    }

    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension, "Courant: " + this.courant, "Résistance: " + this.resistance];
    }

    getType() {
        return AMPOULE;
    }
}

class Condensateur extends Composant {
    constructor(x, y, capacite, orientation) {
      super(x, y);
	    this.capacite = capacite;
      this.charge = 0;
      this.orientation = orientation??0;
    }
    inBounds(x, y) {
      if(this.orientation % PI === 0)
        return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
          y >= this.y - 30 / 2 && y <= this.y + 30 / 2;
      else
        return x >= this.x - 30 / 2 && x <= this.x + 30 / 2 &&
            y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
  }
    
    // offsetX et offsetY à retirer
    draw(offsetX, offsetY) {
      condensateur(this.x + offsetX, this.y + offsetY, this.orientation, isElementSelectionner(this));
    }

    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension, "Charge: " + this.charge, "Capacité: " + this.capacite];
    }
    
    getType() {
        return CONDENSATEUR;
    }
  }

  class Batterie extends Composant {
    constructor(x, y, tension, orientation) {
        super(x, y);
	      this.tension = tension;
        this.orientation = orientation??0;
    }
    inBounds(x, y) {
      if(this.orientation % PI === 0)
        return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
            y >= this.y - 30 / 2 && y <= this.y + 30 / 2;
      else
        return x >= this.x - 30 / 2 && x <= this.x + 30 / 2 &&
            y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
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
      return BATTERIE;
    }
}

class Diode extends Composant {
    constructor(x, y, orientation) {
      super(x, y);
      this.radius = 19;
      this.orientation = orientation??0;
    }
    inBounds(x, y) {
      return x >= this.x - this.radius && x <= this.x + this.radius && 
        y >= this.y - this.radius && y <= this.y + this.radius;

  }
    
    draw(offX, offY) {
      diode(this.x + offX,this.y + offY, this.orientation, isElementSelectionner(this));
    }
    
    draw(offX, offY) {
      diode(this.x + offX,this.y + offY, this.orientation, isElementDrag(this));
    }
    
    getMenu(){
      return ["Position x: " + this.x, "Position y: " + this.y, "Sens: " + this.orientation];
    }

    getType() {
        return DIODE;
    }
  }

class Noeuds extends Composant {
  constructor(x, y){
    super(x, y);
    this.circuitsEnParallele = []; //Array de Circuit qui sont en parallèle (Ceux en série sont dans la class Circuit())

    //C'est variable sont utile pour calculer l'équivalence du noeud
    this.capaciteEQ = 0;
    this.resistanceEQ = 0;
    this.tensionEQ = 0;

    //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
    this.type;

    //Indique si le courant à un chemin pour passer dans au moins une des branches
    this.valide = false; //On assume que c'est faux, mais si une des branches est valide, on le met vrai.
  }

  /**
   * Ajoute un circuit dans l'array de circuit du noeud.
   * @param {*} composant 
   */
  ajouterComposante(composant){
    this.circuitsEnParallele.push(composant);
  }

  retirerCircuit(position){
    this.circuitsEnParallele.splice(position, 1);
  }
 /**
  * Sert à faire les calculs reliés au noeud. Donc les calculs pour les circuits en parallèle se font ici.
  */
 trouverEq(){
    for (const circuit of this.circuitsEnParallele){ 
      circuit.trouverEq();
      if(circuit.valide){
        this.valide = true;
      }
    }

    this.trouverTypeDeCircuit();
    
    switch (this.type){
        case SEULEMENTR:
          let resistanceTemp = 0;
            for (const circuit of this.circuitsEnParallele){ 
              resistanceTemp += 1 / circuit.resistanceEQ;
            }
            this.resistanceEQ = (1 / resistanceTemp).round(2);
            break;
        case SEULEMENTC:
            for (const circuit of this.circuitsEnParallele){ 
              this.capaciteEQ += circuit.capaciteEQ;
            }
            break;
        case RC:
            //C'est là que c'est difficile
            break;
    }

  }

  /**
   * Trouve le type du noeud et le garde en mémoire dans la variable "type" du noeud
   */
  trouverTypeDeCircuit(){
    let circuitR = this.circuitsEnParallele.some(circuit => circuit.getTypeDeCircuit() === SEULEMENTR);
    let circuitC = this.circuitsEnParallele.some(circuit => circuit.getTypeDeCircuit() === SEULEMENTC);
    let circuitRC = this.circuitsEnParallele.some(circuit => circuit.getTypeDeCircuit() === RC);

    if((circuitR && circuitC) || circuitRC){
        this.type = RC;
    }else if (circuitC){
        this.type = SEULEMENTC;
    }else this.type = SEULEMENTR;
  }

  checkConnection(x, y, aproximation){
    return false;
  }

  /**
   * Pour chaque circuit dans l'array de circuit en parallèle, on calcul le nouveau courant et on le distribut dans les résistances
   */
  remplirResisteursAvecDifTension(){
    for (const circuit of this.circuitsEnParallele){
      circuit.courant = this.tensionEQ / circuit.resistanceEQ;
      circuit.remplirResisteursAvecCourant();
    }
  }

  /**
   * Pour chaque circuit dans l'array de circuit en parallèle, on calcul la nouvelle charge et on le distribut dans les condensateurs
   */
  remplirCondensateursAvecTension(){
    for (const circuit of this.circuitsEnParallele){
      circuit.charge = circuit.capaciteEQ * this.tensionEQ;
      circuit.remplirCondensateursAvecCharge();
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
  /**
   * Retourne le type de l'objet
   * @returns 
   */
  getType() {
    return NOEUD;
  }
}
  