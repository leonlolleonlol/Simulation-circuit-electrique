/**
 * Cette classe permet de représenter les fils de notre circuit.
 * Chaque est linéaire et peut être dans n'importe quelle direction a n'importe quel angle.
 */
class Fil {

  /**
   * Créer un nouveau fil avec les arguments du **début du fil** et de la 
   * **fin du fil**. Spécifie aussi un identifiant unique 
   * @param {number} xi cordonné en x du point initial
   * @param {number} yi codonné en y du point initial
   * @param {number} xf cordonné en x du point final
   * @param {number} yf cordonné en y du point final
   * @see [Date.now()]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now} 
   * Fonction qui produit l'identifiant unique
   */
  constructor(xi, yi, xf, yf) {
    this.xi = xi;
    this.yi = yi;
    this.xf = xf;
    this.yf = yf;
    this.courant = 2;
    this.id = Date.now();
    this.type = FIL;

  }
  
  /**
   * Permet de déterminer si une position se situe dans l'aire de contact du fil.
   * Le rayon d'approximation permis est toujours de 15 exlu
   * @param {number} x coordoné en x à tester
   * @param {number} y coordoné en y à tester
   * @returns {boolean}
   * @see {@link Composant#inBounds | Composant.inBounds()}
   */
  inBounds(x, y) {
    if (!this.inBoxBounds(x, y)) {
      return false;
    }
    let fx = this.getFunction();
    let xTest = y * 1 / fx.pente + fx.ordonneY;
    let yTest = x * fx.pente + fx.ordonneX;
    return dist(xTest, y, x, y) < 15 || dist(x, yTest, x, y) < 15;
  }

  /**
   * Détermine si une position se situe dans un carré ayant pour borne les coins
   * du fil +10 partout. Fait un calcul rapide
   * @param {number} x coordoné en x
   * @param {number} y coordoné en y
   * {@link Fil#inBounds | Fil.inBounds()}
   * @returns {boolean}
   */
  inBoxBounds(x, y, approximation) {
    approximation ??= 10;
    return x > Math.min(this.xi - approximation, this.xf - approximation) &&
      x < Math.max(this.xi + approximation, this.xf + approximation) &&
      y > Math.min(this.yi - approximation, this.yf - approximation) &&
      y < Math.max(this.yi + approximation, this.yf + approximation);
  }

  /**
   * Calcule la pente du fil
   * @returns {number}
   */
  pente() {
    return (this.yf - this.yi) / (this.xf - this.xi);
  }

  isPenteConstante() {
    return this.xi == this.xf || this.yi == this.yf;
  }

  /**
   * @typedef {Object} FunctionObject Cette objet rassemble la pente et l'ordonné à l'origine d'une fonction 
   * `f(x) = mx + b`. Aussi, en faisant `1/pente` et en prennant l'ordonne en y, on peut avoir la
   * fonction `f(y) = my + b`
   * @property {number} pente La pente de la fonction `f(x)`
   * @property {number} ordonneX L'ordonné à l'origine pour une fonction `f(x)`
   * @property {number} ordonneY L'ordonné à l'origine pour une fonction `f(y)`. Paramètre
   * utile lorsque le fil est vertical
   */

  /**
   * Imaginons que l'on remplace le fil par une fonction linéaire continue. La 
   * seule différence entre les deux droite est que le fil un domaine précis (entre xi et xf).
   * Cette fonction permet d'avoir les donné pour une droite linéaire.
   * @returns {FunctionObject} La fonction représentant le fil
   */
  getFunction() {
    let penteFil = this.pente();
    return {
      pente: penteFil, ordonneX: this.yi - this.xi * penteFil,
      ordonneY: this.xi - this.yi * 1 / penteFil
    };
  }

  /**
   * Calcule l'angle d'inclinaison du fil. 
   * @returns l'angle en radian
   * @see {@link Fil#pente | Fil.pente()}
   */
  angle() {
    return Math.atan(1 / this.pente());
  }

  /**
   * Calcule la longueur du fil. La valeur est toujours positive
   * @returns La longueur du fil
   */
  longueur() {
    return dist(this.xi, this.yi, this.xf, this.yf);
  }

  /**
   * Vérifie si un fil se superpose partiellement, complètement ou simplement par 
   * les bornes.
   * @param {Fil} fil Le fil qui va être comparer
   * @return {boolean}
   * @example 
   * let fil1 = new Fil(30, 50, 80, 50)
   * let fil2 = new Fil(70, 50, 100, 50)
   * fil1.overlap(fil2) //true
   * let fil3 = new Fil(50, 50, 100, 50)
   * let fil4 = new Fil(20, 50, 40, 50)
   * fil3.overlap(fil4) //false
   * let fil5 = new Fil(390, 210, 510, 270) //xi: 390, yi: 210, xf: 510, yf: 270
   * let fil6 = new Fil(270, 150, 630, 330) //xi: 270, yi: 150, xf: 630, yf: 330
   * fil5.overlap(filg) //true
   */
  overlap(fil) {
    let f1 = this.getFunction();
    let f2 = fil.getFunction();
    if (Math.abs(f1.pente) === Math.abs(f2.pente) &&
      Math.abs(f1.ordonneX) === Math.abs(f2.ordonneX)) {
      if ((f1.pente == 0 && this.yi === fil.yi) || Math.abs(f1.pente) != Infinity) {
        return (fil.xi >= this.xi && fil.xi <= this.xf) || (this.xi >= fil.xi && this.xi <= fil.xf);
      } else if (Math.abs(f1.pente) == Infinity && this.xi === fil.xi) {
        return (fil.yi >= this.yi && fil.xi <= this.yf) || (this.yi >= fil.yi && this.yi <= fil.yf);
      }
    }
    else return false;
  }

  /**
   * Permet de trouver l'intersection entre deux fils. Cette fonction est différente
   * de {@link overlap} puisque il faut que la droite n'intersecte en un endroit (pas
   * paralèlle).
   * @param {Fil} fil Le fil que l'on veut comparer
   * @returns {object} Une position ou null si rien n'a été trouvé
   */
  intersection(fil) {
    let f1 = this.getFunction();
    let f2 = fil.getFunction();
    if (Math.abs(f1.pente) == Math.abs(f2.pente)) {
      return null;
    }
    let yfunction1 = Math.abs(f1.pente) != Infinity
    let yfunction2 = Math.abs(f2.pente) != Infinity;
    let yCord;
    let xCord;
    if (yfunction1 && yfunction2) {
      xCord = (f1.ordonneX - f2.ordonneX) / (f2.pente - f1.pente);
      yCord = f1.pente * xCord + f1.ordonneX;
    } else if (yfunction1 && !yfunction2) {
      xCord = f2.ordonneY;
      yCord = f1.pente * xCord + f1.ordonneX;
    } else if (!yfunction1 && yfunction2) {
      xCord = f1.ordonneY;
      yCord = f2.pente * xCord + f2.ordonneX;
    }

    if (this.inBoxBounds(xCord, yCord, 1) && fil.inBoxBounds(xCord, yCord, 1)) {
      return { x: xCord, y: yCord };
    }
  }

  /**
   * Ordonne les points du plus petit au plus grand selon l'orientation.
   * - Si l'orientation est vertical (`fil.pente() == Infinity`), trier selon y
   * - Sinon, trier selon x
   */
  trierPoint() {
    let sortArray = [{ x: this.xi, y: this.yi }, { x: this.xf, y: this.yf }];
    if (Math.abs(this.pente()) == Infinity) {
      sortArray.sort((a, b) => a.y - b.y);
    } else sortArray.sort((a, b) => a.x - b.x);
    this.xi = sortArray[0].x;
    this.yi = sortArray[0].y;
    this.xf = sortArray[1].x;
    this.yf = sortArray[1].y;
  }
  UsePrint() {
    print("trying new thing");
  }

  /**
   * Récuperer le type de la classe. Important pour la sérialisation et désérialisation
   * de la classe
   * @returns FIL 
   */
  getType() {
    return this.type;
  }
}


/**
 * Vérifie si l'on peut commencer un nouveau fil à une position donné. Les critère sont:
 *  - Le point se situe dans la grille visible
 *  - Le fil connecte aux borne d'un composant ou touche à un autre fil
 * @param {number} x la position en x
 * @param {number} y la position en y
 * @returns Si un nouveau fil peut commencer à cette position
 */
function validFilBegin(x, y) {
  let point = findGridLock(grid.translateX, grid.translateY)
  if (!inGrid(mouseX / grid.scale, mouseY / grid.scale) || dist(point.x, point.y, x, y) > 10) {
    return false;
  }
  else {
    return getConnectingComposant(x, y) != null || filStart(x, y) != null;
  }
}

/**
 * Calcule la position pour un pourcentage du fil entre 0 et 1
 * @param {Fil} fil Le fil concerner par le calcul
 * @param {number} percent Le pourcentage entre 0 et 1 pour sélectionner la position du fil
 * @returns L'objet contenant la position x, y
 */
function posAtPercent(fil, percent) {
  //https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path
  let dx = fil.xf - fil.xi;
  let dy = fil.yf - fil.yi;
  return ({
    x: fil.xi + dx * percent,
    y: fil.yi + dy * percent
  });
}