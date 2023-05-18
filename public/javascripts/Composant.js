/**
 * Cet interface permet de définir tout les méthode nécéssaire pour le programme
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
  }

  /**
   * Dessine un composant quelconque sur le canvas. Utilise la librairie p5.js pour le faire. 
   * Chaque implémentation doit toujours commencer avec un `push()` et finir avec un `pop()` pour 
   * que chaque modification des attributs de dessin soit annuler à la sortie de la méthode.
   * @abstract
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

  /**
   * Getter pour le type de composant
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
 * 
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
  draw() {
      ampoule(this.x,this.y, this.orientation, isElementSelectionner(this));
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
  draw() {
    condensateur(this.x, this.y, this.orientation, isElementSelectionner(this));
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

  /**
   * @inheritdoc
   */
  draw() {
      batterie(this.x, this.y, this.orientation, isElementSelectionner(this));
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
  draw() {
    diode(this.x, this.y, this.orientation, isElementSelectionner(this));
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
  
