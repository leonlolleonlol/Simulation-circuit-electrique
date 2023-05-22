

/** 
 * Classe pour le modèle de vue. C'est aussi utilisé présentement pour les calculs.
 * Elle rassemble toute les méthodes et les attribut pour dessiner un composant sur le
 * canvas. Pour modifier si l'on veut dessiner un condensateur ou un resisteur,
 * on modifie l'attribut `type` du composant. Il est par contre important d'utiliser la 
 * méthode {@link setObjectType} puisque d'autre attributs sont calculé selon celui-ci
 */
class Composant {

  /**
   * Créer un composant avec une position, des valeurs mathématique =0 et un identifiant unique
   * @param {number} [x] 
   * @param {number} [y]
   * @param {string} type
   * @param {number} [orientation = 0]
   */
  constructor(type, x=0, y=0, orientation=0){
    //information importante pour la sauvegarde
    this.id = Date.now();// Donne un identifiant unique à chaque composant
    this.x = x;
    this.y = y;
    this.orientation = orientation;

    Composant.setObjectType(this, type);

    // Inoformation pour les calculs
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
   */
  draw() {
    let focus = isElementSelectionner(this);
    switch (type) {
      case RESISTEUR:resisteur(this.x, this.y, this.orientation, focus);
      case AMPOULE: ampoule(this.x, this.y, this.orientation, focus);
      case CONDENSATEUR: condensateur(this.x, this.y, this.orientation, focus);
      case BATTERIE: batterie(this.x, this.y, this.orientation, focus);
      case DIODE: diode(this.x, this.y, this.orientation, focus);
      default: throw `Le type ${type} de dessin n'est pas pas un type valide`;
    }
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
    return rectInBound(x, y);
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
   * Retourne une borne à quelle  une position x y touche. La position retourner n'est pas (x, y)
   * mais c'est juste savoir si la borne touché est en haut, en bas, à droite ou à gauche.
   * @param {number} x 
   * @param {number} y 
   * @param {number} [approximation = 0] 
   * @returns La borne revoie le position relative touché ou sinon undefined
   */
  getBorne(x, y, approximation=0){
    if(this.orientation % PI == 0){
      if(dist(this.x + 60/2, this.y, x, y) <= approximation)
        return DROITE;
      else if (dist(this.x - 60/2, this.y, x, y) <= approximation)
        return GAUCHE;
    } else if (this.orientation % HALF_PI == 0){
      if(dist(this.x, this.y + 60/2, x, y) <= approximation)
        return BAS;
      else if (dist(this.x, this.y - 60/2, x, y) <= approximation)
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
   * Le titre utilisé pour l'affichage
   */
  getTitle(){
    return this.titre;
  }

  static setObjectType(composant, type){
    composant.type = type;
    let info = getContextObject(type);
    if(info.radius == null){
      composant.width = 60;
      composant.height = info.height;
    }else composant.radius = info.radius;
    if(info.inBoundsType == 'round'){
      composant.inBounds = roundInBound;
    }else composant.inBounds = rectInBound;//pour éviter erreur par défaux roudInBound
    this.titre = info.titre;
  }
} 

/** 
 * @extends Composant 
 * @deprecated
 */
class Resisteur extends Composant {
  constructor(x, y, resistance, orientation) {
      super(RESISTEUR, x, y, orientation);
      this.resistance = resistance;
  }
    getEq(sens){
      return (sens?'-':'')+this.resistance+this.symbole;
    }
}


/**
 * Représentation d'une ampoule
 * @extends Composant 
 * @deprecated
 */
class Ampoule extends Resisteur {
  constructor(x, y, resistance, orientation) {
      super(x, y,resistanc, orientation);
      Composant.setObjectType(this, AMPOULE);
  }
}

/**
 * Représentation du condensateur
 * @extends Composant 
 * @deprecated Cet objet n'est **PAS** implémenter à cause du problème des circuits RC
 */
class Condensateur extends Composant {
  constructor(x, y, capacite, orientation) {
    super(CONDENSATEUR, x, y, orientation);
    this.capacite = capacite;
    this.charge = 0;
  }
}

/**
 * Représentation d'une source de courant (batterie)
 * @extends Composant 
 * @deprecated
 */
class Batterie extends Composant {
  constructor(x, y, tension, orientation) {
      super(x, y, BATTERIE, orientation);
      this.tension = tension;
  }
  getEq(sens){
    return (this.orientaion % PI === 0 || sens) && !(this.orientaion % PI === 0 && sens) ? -this.tension : this.tension;
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
    super(x, y, 38, 38, DIODE, orientation);
    this.radius = 19;
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
    super(x, y, 0, 0, NOEUD, 'Noeud', 0);
    this.circuitsEnParallele = []; //Array de Circuit qui sont en parallèle (Ceux en série sont dans la class Circuit())

    //C'est variable sont utile pour calculer l'équivalence du noeud
    this.capaciteEQ = 0;
    this.resistanceEQ = 0;
    this.tensionEQ = 0;

    //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
    this.type='';
    this.titre = 'Nœud'

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

function rectInBound(x, y){
  if(this.orientation % PI === 0)
    return x >= this.x - this.width / 2 && x <= this.x + this.width / 2 &&
      y >= this.y - this.height / 2 && y <= this.y + this.height / 2;
  else if(this.orientation % HALF_PI === 0)
    return x >= this.x - this.height / 2 && x <= this.x + this.height / 2 &&
      y >= this.y - this.width / 2 && y <= this.y + this.width / 2;
  else {
    let taille = Math.max(this.width, this.height);
    return x >= this.x - taille / 2 && x <= this.x + taille / 2 &&
      y >= this.y - taille / 2 && y <= this.y + taille / 2;
  }
}

function roundInBound(x, y){
  return x >= this.x - this.radius && x <= this.x + this.radius && 
         y >= this.y - this.radius && y <= this.y + this.radius;
}


function getContextObject(type){
  switch (type) {
    case RESISTEUR: return resisteurStaticInfo;
    case AMPOULE: return ampouleStaticInfo;
    case CONDENSATEUR: return condensateurStaticInfo;
    case DIODE: return diodeStaticInfo;
    case BATTERIE: return batterieStaticInfo;
    default: throw 'Le type n\'est pas supporté';
  }
}

const resisteurStaticInfo = Object.freeze({
  titre: 'Résisteur',
  height: 25,
  inBoundsType: 'rect',
});

const ampouleStaticInfo = Object.freeze({
  titre: 'Ampoule',
  height: 22,
  inBoundsType: 'rect',
});

const condensateurStaticInfo = Object.freeze({
  titre: 'Condensateur',
  height: 30,
  inBoundsType: 'rect',
});;

const batterieStaticInfo = Object.freeze({
  titre: 'Batterie',  
  height: 30,
  inBoundsType: 'rect',
});;

const diodeStaticInfo = Object.freeze({
  titre: 'Diode',
  radius:19,
  inBoundsType: 'round',
});;