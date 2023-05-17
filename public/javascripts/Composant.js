

/** Cet interface permet de définir tout les méthode nécéssaire pour le programme
 * @interface
 */
class Composant {

  /**
   * Créer un composant avec une position, des valeurs mathématique =0 et un identifiant unique
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x, y){
    this.id = Date.now();// Donne un identifiant unique à chaque composant
    this.x = x;
    this.y = y;
    // on crée automatiquement une classe de tension
    this.courant = 0;
    this.tension = 0;
    this.prochaineComposante = [];
    this.composantePrecedente = [];
    this.dejaPasser = false;
  }

  /**
   * Dessine un composant quelconque sur le canvas. Utilise la librairie p5.js pour le faire. 
   * Chaque implémentation doit toujours commencer avec un `push()` et finir avec un `pop()` pour 
   * que chaque modification des attributs de dessin soit annuler à la sortie de la méthode.
   * @abstract
   * @todo offsetX et offsetY à retirer
   */
  draw() {
    throw new Error('Cette fonction ne peut pas être appelé de l\'interface');
  }

  /**
   * Permet de calculer si un cordonné (x, y) se situe dans le périmètre de contact 
   * du composant.
   * @abstract
   * @param {number} x cordonné x
   * @param {number} y cordonné y
   * @returns {boolean}
   */
  inBounds(x, y) {
    throw new Error('Cette fonction ne peut pas être appelé de l\'interface');
  }

  /**
   * Chaque composant possède deux borne opposé qui sont les connections avec les fils. Cette fonction 
   * permet de faire vérfifier si une position entre en contact avec une des bornes.
   * @param {number} x cordonné x
   * @param {number} y cordonné y
   * @param {number} approximation rayon d'approximation permis
   * @returns {boolean} si une borne est touché par le point
   * @see Composant#getBorne simplification de la fonction
   */
  checkConnection(x, y, approximation){
    return this.getBorne(x,y,approximation)!=null;
  }
  /**
   * Fonction qui permet de récupérer les positions x et y des bornes. Cette fonction dépend 
   * de l'orientation du composant.
   * @returns Les positions des bornes trier en ordre de grandeur du composant
   */
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

  /**
   * Cette fonction est équivalente avec getConnections sauf que tu peux préciser une
   * borne spécifique à récupérer.
   * @param {Pos} borne Une borne spécifique (HAUT, BAS, GAUCHE, DROITE)
   * @returns La position de la connexion
   */
  getConnection(borne){
    let connections = this.getConnections();
    return (borne == GAUCHE || borne ==HAUT)
    ? connections[0] : connections[1];
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} approximation 
   * @returns La borne que le position touche ou null
   */
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

  /**
   * 
   * @param {boolean} inverse 
   */
  rotate(inverse){
    this.orientation = (this.orientation + (inverse?-HALF_PI:HALF_PI)) % TWO_PI
  }


 /** Retourne les valeurs importantes à montrer à l'utilisateur dans une array
  * @returns 
  */
  getMenu(){
    throw "getMenu est appelé dans la class mère";
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
  
  /** Getter pour le type de composant
   * @returns le type de composant
   */
  getType() {
    return this.type;
  }

  /**
   * 
   */
  getTitle(){
    throw new Error('Cette fonction ne peut pas être appelé de l\'interface');
  }
} 

/** 
 * @extends Composant 
 */
class Resisteur extends Composant {
  constructor(x, y, resistance, orientation) {
      super(x, y);
      this.resistance = resistance;
      this.orientation = orientation??0;
      this.type = RESISTEUR;
  }
  inBounds(x, y) {
    if(this.orientation % PI === 0)
      return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
          y >= this.y - 25 / 2 && y <= this.y + 25 / 2;
    else
      return x >= this.x - 25 / 2 && x <= this.x + 25 / 2 &&
          y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
  }

    getMenu(){
      return ["DeltaV: " + this.tension, "Courant: " + this.courant, "Résistance: " + this.resistance];
    }
    getEq(sens){
      return (sens?'-':'')+this.resistance+this.symbole;
    }

  /**
   * @inheritdoc
   */
  draw(offX, offY) {
      resisteur(this.x + offX,this.y + offY,this.orientation, isElementSelectionner(this));
  }

  /**
   * @inheritdoc
   */
  getTitle(){
    return 'Résisteur';
  }
}


/**
 * Représentation d'une ampoule
 * @extends Resisteur 
 */
class Ampoule extends Resisteur {
  constructor(x, y, resistance, orientation) {
      super(x, y, resistance, orientation);
      this.type = AMPOULE;
  }
  inBounds(x, y) {
    if(this.orientation % PI === 0)
      return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
          y >= this.y - 22 / 2 && y <= this.y + 22 / 2;
    else
      return x >= this.x - 22 / 2 && x <= this.x + 22 / 2 &&
          y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
  }

 /**
  * @inheritdoc
  */
  draw(offX, offY) {
      ampoule(this.x + offX,this.y + offY, this.orientation, isElementSelectionner(this));
  }
  getMenu(){
    return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension, "Courant: " + this.courant, "Résistance: " + this.resistance];
  }

 /**
  * @inheritdoc
  */
  getTitle(){
    return 'Ampoule';
  }
}

/**
 * Représentation du condensateur
 * @extends Composant 
 * @deprecated Cet objet n'est **PAS** implémenter à cause du problème des circuits RC
 */
class Condensateur extends Composant {
  constructor(x, y, capacite, orientation) {
    super(x, y);
    this.capacite = capacite;
    this.charge = 0;
    this.orientation = orientation??0;
    this.type = CONDENSATEUR;
  }
  inBounds(x, y) {
    if(this.orientation % PI === 0)
      return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
        y >= this.y - 30 / 2 && y <= this.y + 30 / 2;
    else
      return x >= this.x - 30 / 2 && x <= this.x + 30 / 2 &&
          y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
}
  
  /**
   * @inheritdoc
   */
  draw(offsetX, offsetY) {
    condensateur(this.x + offsetX, this.y + offsetY, this.orientation, isElementSelectionner(this));
  }

  /**
   * @inheritdoc
   */
  getTitle(){
    return 'Condensateur';
  }
}

/**
 * Représentation d'une source de courant (batterie)
 * @extends Composant 
 */
class Batterie extends Composant {
  constructor(x, y, tension, orientation) {
      super(x, y);
      this.tension = tension;
      this.orientation = orientation??0;
      this.type = BATTERIE;
  }
  inBounds(x, y) {
    if(this.orientation % PI === 0)
      return x >= this.x - 60 / 2 && x <= this.x + 60 / 2 &&
          y >= this.y - 30 / 2 && y <= this.y + 30 / 2;
    else
      return x >= this.x - 30 / 2 && x <= this.x + 30 / 2 &&
            y >= this.y - 60 / 2 && y <= this.y + 60 / 2;
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
    
  getMenu(){
    return ["Position x: " + this.x, "Position y: " + this.y, "DeltaV: " + this.tension, "Charge: " + this.charge, "Capacité: " + this.capacite];
  }
    


  /**
   * @inheritdoc
   */
  draw(offX, offY) {
      batterie(this.x + offX, this.y + offY, this.orientation, isElementSelectionner(this));
  }

  /**
   * @inheritdoc
   */
  getTitle(){
    return 'Batterie';
  }
}

/**
 * Représentation d'une diode
 * @extends Composant 
 * @deprecated Pour l'instant l'objet n'est **PAS** accessible puisque les calculs se complexifie
 * beaucoup si on implémentait la diode
 */
class Diode extends Composant {
  constructor(x, y, orientation) {
    super(x, y);
    this.radius = 19;
    this.orientation = orientation??0;
    this.type = DIODE;
  }
  inBounds(x, y) {
    return x >= this.x - this.radius && x <= this.x + this.radius && 
      y >= this.y - this.radius && y <= this.y + this.radius;

}
  
  /**
   * @inheritdoc
   */
  draw(offX, offY) {
    diode(this.x + offX,this.y + offY, this.orientation, isElementSelectionner(this));
  }
  
  /**
   * @inheritdoc
   */
  getMenu(){
    return ["Position x: " + this.x, "Position y: " + this.y, "Sens: " + this.orientation];
  }

  /**
   * @inheritdoc
   */
  getTitle(){
    return 'Diode';

  }
}

/**
 * Cette classe est une représentation mathématique de la dérivation de brache (branche en parallèle). 
 * Elle rassemble donc toute les branches en parallèle et cela permet de faire les calculs 
 * d'équivalence du circuit et autre.
 * @extends Composant 
 */
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
/**
 * Vérifie si un nouveau composant ou un composant que l'on a modifier a une position valide. 
 * Les critères sont que le composant se situe dans la grille et qu'il ne connecte pas
 * avec les bornes d'un composant
 * @param {Composant} composant Le composant que l'on veut valider la position
 * @returns Si la position du composant est valide
 */
function validComposantPos(composant){
  if (!inGrid(composant.x + grid.translateX, composant.y + grid.translateY))
    return false;
  return !components.some(element =>element.checkConnection(composant.x,composant.y,1) || composant.checkConnection(element.x,element.y,1));
}
  