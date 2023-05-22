function test(){
    p1 = new Batterie(0, 0, 12);
    r1 = new Resisteur(0, 0, 500)
    
    n1 = new Noeuds();
    
    c2 = new Circuit();
    c3 = new Circuit();
  
    r2 = new Resisteur(0, 0, 800);
    r3 = new Resisteur(0, 0, 1100);
    r4 = new Resisteur(0, 0, 450); 
    
  
    r5 = new Resisteur(0, 0, 400);
    r6 = new Resisteur(0, 0, 250);
    r7 = new Resisteur(0, 0, 100);
    c4 = new Circuit();
    c5 = new Circuit();
    n2 = new Noeuds();
    n3 = new Noeuds();
    n4 = new Noeuds();
    /*
    c4.ajouterComposante(r5);
    c4.ajouterComposante(r6);
    c5.ajouterComposante(r7);
    n2.ajouterComposante(c4);
    n2.ajouterComposante(c5);
  
    c3 = new Circuit(false);
    c3.ajouterComposanteALaFin(new Condensateur(0, 0, 90));
    c3.ajouterComposanteALaFin(n2);
    n1.ajouterComposanteALaFin(c3);
    
    c1.ajouterComposanteALaFin(n1);
    */
    
    /*
    c1.ajouterComposante(n1);
    c1.ajouterComposante(r1);
    c1.ajouterComposante(n2);
    c1.ajouterComposante(r4);
    c1.ajouterComposante(r3);
    */
  
    c1.ajouterComposante(p1);
    
    c1.connectComposante(p1, n1);
    c1.connectComposante(n1, n2);
    c1.connectComposante(n1, r4);
  
    c1.connectComposante(n2, r2);
    c1.connectComposante(n2, r1);
  
    c1.connectComposante(r2, r3);
  
    c1.connectComposante(r3, n3);
    c1.connectComposante(r1, n3);
  
    c1.connectComposante(n3, n4);
    c1.connectComposante(r4, n4);
  
    c1.connectComposante(n4, r5);
    c1.connectComposante(r5, r6);
    c1.connectComposante(r6, p1);
    c1.update();
  
    print("r1: i = " + r1.courant.round(5) + "A; DeltaV = " + r1.tension.round(2) + "V");
    print("r2: i = " + r2.courant.round(5) + "A; DeltaV = " + r2.tension.round(2) + "V");
    print("r3: i = " + r3.courant.round(5) + "A; DeltaV = " + r3.tension.round(2) + "V");
    print("r4: i = " + r4.courant.round(5) + "A; DeltaV = " + r4.tension.round(2) + "V");
    print("r5: i = " + r5.courant.round(5) + "A; DeltaV = " + r5.tension.round(2) + "V");
    print("r6: i = " + r6.courant.round(5) + "A; DeltaV = " + r6.tension.round(2) + "V");
    print("r7: i = " + r7.courant.round(5) + "A; DeltaV = " + r7.tension.round(2) + "V");
   
    
    //c1.solveCourrantkirchhoff();
}

/**
 * Permet de trouver la position idéal en x et y à partir de la 
 * position de la souris
 * @param {number} offsetX Le décalage en x
 * @param {number} offsetY Le décalage en y
 * @returns Le point le plus proche sur la grille
 */
function findGridLock(offsetX, offsetY) {
    let lockX = Math.round((mouseX/grid.scale - offsetX) / grid.tailleCell) *
      grid.tailleCell;
    let lockY = Math.round((mouseY/grid.scale  - offsetY) / grid.tailleCell) * 
      grid.tailleCell
    return {x:lockX, y: lockY};
  }
  
  /**
   * Vérifie si la position en x et y se situe dans le spectre visible de la grille.
   * Cette vérification ne prend en compte que le décalage de la grille par rapport au canvas
   * @param {number} x la position en y (doit inclure translateX si nécéssaire)
   * @param {number} y la position en x (doit inclure translateY si nécéssaire)
   * @returns {boolean} Le point se situe dans la grille
   */
  function inGrid(x, y){
    return x > grid.offsetX && y > grid.offsetY
  }
  
  /**
   * Vérification si un élément est déplacer
   * @param {*} element Un élement qui peut être drag
   * @returns boolean si cet élément est présentement déplacé
   */
  function isElementDrag(element){
    return drag!=null && drag === element;
  }
  
  /**
   * Vérification de la sélection d'un élément
   * @param {*} element Un élement qui peut être sélectionner
   * @returns boolean si cet élément est présentement sélectionner
   */
  function isElementSelectionner(element){
    return selection!=null && selection === element;
  }
  
  /**
   * Vérifie si un point en x et y connecte au borne d'un composant sur la grille et 
   * retourne ce composant si c'est le cas. On peut spécifier l'option de retourner tout les 
   * composants qui connecte
   * @param {number} x la position en x
   * @param {number} y la position en y
   * @param {boolean} [first] Retourne soit le premier élément trouver, soit tout les éléments
   * @returns Le composant trouvé ou null
   */
  function getConnectingComposant(x, y, first=true){
    let isConnecting = element => element.checkConnection(x, y, 10);
    return first ? components.find(isConnecting) : components.filter(isConnecting);
  }
  
  /**
   * Vérifie si un point x et y est valide pour commencer un nouveau fil et
   * retourne ce fil si c'est le cas
   * @param {number} x la position en x
   * @param {number} y la position en y
   * @param {boolean} [first] Retourne soit le premier élément trouver, soit tout les éléments
   * @returns Le fil trouvé qui connecte ou null
   */
  function filStart(x, y, first = true){
    let connections = [];
    for (const fil of fils) {
      if(!fil.isPenteConstante()){
        if(dist(fil.xi, fil.yi, x, y)<10 ||
           dist(fil.xf, fil.yf, x, y)<10){
          if(!first)
            connections.push(fil);
          else return fil;
        }
      } else if(fil.inBoxBounds(x, y)){
        if(!first)
          connections.push(fil);
        else return fil;
      }
    }
    return !first ? connections : null;
  }
  
  /**
   * Permet de récupérer tout les fils et composants dont l'une de leurs bornes 
   * à la même position qu'un coordonné x et y. 
   * **ATTENTION**: Elle inclut aussi la position du composant qui a les coordonés
   * @param {number} x coordoné en x 
   * @param {number} y coordoné en y
   * @param {boolean} first Condition s'y l'on veut que s'arrêter au premier composant trouvé
   * Ce paramètre est seulement important si l'on veut vérifier la précence ou l'absence de connection
   * @returns {Array} Tout les éléments qui sont connecter à cette position. 
   */
  function getPossibleConnections(x, y, first = false) {
    return filStart(x, y, first).concat(getConnectingComposant(x, y, first));
  }
  
  
    /**
     * @typedef {Connection}
     * @property {Array} connections - La liste de tout les composant relier sur une cordonné x et y.
     * @property {number} x - La cordonné en x de la connection
     * @property {number} y - La cordonné en y de la connection.
     */
    
    /**
     * @typedef {ConnectionPair} 
     * @global
     * @property {Connection} left - La connection de gauche du composant.
     * @property {Connection} right - La connection de droite du composant.
     */
    
    
    /**
     * Récupère toute les connections qui sont relier au cordonné d'un composant ou d'un fil.
     * Pour un composant, ce sont par contre les cordonné des bornes qui sont récupérer. En fait,
     * cette méthode est une dérivé de {@link getPossibleConnections} puisqu'elle ne fait qu'assembler
     * les résultats fournis en un seul objet.
     * @param {(Composant|Fil)} element L'élément du circuit que l'on veut récupérer les connections
     * @returns {ConnectionPair} Les connections pour chaqu'une des bornes de l'élément (2 bornes)
     * @see getConnections Pour récupérer position borne
     * @see getPossibleConnections C'est la méthode qui récupère vraiment les connections
     */
    function getAllConnection(element){
      let initial;
      let final;
      if(element instanceof Composant){
        let bornes = element.getConnections();
        initial = bornes[0];
        final = bornes[1];
      }else{
        initial = {x:element.xi, y:element.yi};
        final = {x:element.xf, y:element.yf};
      }
      let connectL = getPossibleConnections(initial.x, initial.y, false);
      let connectR = getPossibleConnections(final.x, final.y, false);
      return {
        left:{connections:connectL, x:initial.x, y:initial.y}, 
        right:{connections:connectR, x:final.x, y:final.y,}
      };
    }