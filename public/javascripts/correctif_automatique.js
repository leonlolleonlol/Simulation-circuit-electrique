/**
 * Effectue les ajustements automatique après la création d'un nouveau fil par l'utilisateur.
 * 1. Ordonner les points initiaux et finaux plus petit au plus grand (xi doit être < que xf)
 * 2. Unir certains fils possible en un seul fil
 * 3. Coupe le fil dépendant des composants par lequel il passe
 * 4. Coupe le fil pour respecter les noeuds
 * @param {Fil} fil Le nouveau fil
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne 
 * effectuer dans la fonction
 */
function ajustementAutomatiqueFil(fil, actions) {
  fil.trierPoint();
  for (let index = 0; index < fils.length; index++) {
    const testFil = fils[index];
    if (testFil !== fil && fil.overlap(testFil)) {
      let array = [{ x: testFil.xi, y: testFil.yi }, { x: testFil.xf, y: testFil.yf },
      { x: fil.xi, y: fil.yi }, { x: fil.xf, y: fil.yf }];
      if (Math.abs(testFil.pente()) == Infinity)
        array.sort(function (a, b) { return a.y - b.y });
      else array.sort(function (a, b) { return a.x - b.x });
      fil.xi = array[0].x;
      fil.yi = array[0].y;
      fil.xf = array[array.length - 1].x;
      fil.yf = array[array.length - 1].y;
      fils.splice(index, 1);
      actions.push({ type: SUPPRIMER, objet: testFil, index });
      index--;
    }
  }
  verifierCouperFil(fil, actions);
  verifierCouperNoeud(fil, actions);
}

/**
 * Cette fonction permet de faire les appels pour la fonctions couperFil pour chaque composant.
 * Elle a été créer pour nous permettre d'éviter lorsque l'on créer dans la fonction couperFil
 * un nouveau fil de répasser par la fonction ajustementNouveauFil au complet.
 * @param {Fil} fil Le fil à vérifier
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne 
 * effectuer dans la fonction
 */
function verifierCouperFil(fil, actions) {
  if (fil.isPenteConstante()) {
    for (const composant of components) {
      let continuer = couperFil(fil, composant, actions);
      if (!continuer)
        return;
    }
  }
}


/**
 * Vérifie si un fil à besoin d'être coupé pour connecter à un composant ou un autre fil.
 * @param {Fil} fil Le fil à vérifier
 * @param {Array} actions La liste d'action à enregistrer dans l'historique
 */
function verifierCouperNoeud(fil, actions) {
  for (let index = 0; index < fils.length; index++) {
    const element = fils[index];
    if (element != fil && fil.isPenteConstante() && element.isPenteConstante()) {
      let pointIntersect = element.intersection(fil);
      if (pointIntersect != null) {
        if (!((element.xi == pointIntersect.x && element.yi == pointIntersect.y) ||
          (element.xf == pointIntersect.x && element.yf == pointIntersect.y))) {
          splitFil(element, actions, pointIntersect);
          index--;
        }
        if (!((fil.xi == pointIntersect.x && fil.yi == pointIntersect.y) ||
          (fil.xf == pointIntersect.x && fil.yf == pointIntersect.y))) {
          let newFils = splitFil(fil, actions, pointIntersect);
          verifierCouperNoeud(newFils[0], actions);
          verifierCouperNoeud(newFils[1], actions);
          return;
        }
      }
    }
  }
}

/**
 * Après la modification ou la création d'un composant, coupe tout les fil qui sont connecter
 * avec le composant. Cette méthode complète {@link couperFil} pour toute les situations où un
 * composant n'est pas perpendiculaire avec le fil
 * @param {Composant} composant 
 * @param {Array} actions 
 */
function verifierSplitNewComposant(composant, actions) {
  let connections = composant.getConnections();
  let left = filStart(connections[0].x, connections[0].y, false);
  let right = filStart(connections[1].x, connections[1].y, false);
  let bornes = [left, right];
  for (let index = 0; index < bornes.length; index++) {
    const borne = bornes[index];
    const connection = connections[index];
    if (borne != null) {
      for (const element of borne) {
        if (!((element.xi == connection.x && element.yi == connection.y) ||
          (element.xf == connection.x && element.yf == connection.y))) {
          splitFil(element, actions, connection);
        }
      }
    }
  }
}


/**
 * Coupe un fil en deux nouveau fils. Supprime aussi l'ancien fil du répertoire
 * @param {Fil} fil 
 * @param {Array} actions 
 * @param {object} borneSeparation1 Borne de fin du nouveau fil 1. Peut aussi servir de borne
 * de début du deuxième fil
 * @param {object} [borneSeparation2] Borne optionnel du début du nouveau fil 2. 
 * @return {Array} Les nouveaux fils
 */
function splitFil(fil, actions, borneSeparation1, borneSeparation2) {
  borneSeparation2 ??= borneSeparation1;
  let fil1 = new Fil(fil.xi, fil.yi, borneSeparation1.x, borneSeparation1.y);
  let fil2 = new Fil(borneSeparation2.x, borneSeparation2.y, fil.xf, fil.yf);
  let index = fils.indexOf(fil);
  fils.splice(index, 1);
  fils.push(fil1, fil2);
  actions.push({ type: SUPPRIMER, objet: fil, index },
    { type: CREATE, objet: fil1 }, { type: CREATE, objet: fil2 });
  return [fil1, fil2];
}

/**
 * Fonction permettant d'appliquer la règle qu'un fil doit toujours se connecter à un 
 * autre fil ou au borne d'un composant. Dans cette fonction, on vérifier qu'un composant
 * connecte avec un fil et si c'est le cas, on change si nécéssaire les valeur de positions
 * des bornes du fil pour qu'il connecte au composant ou on le supprime tout simplement
 * @param {Fil} fil Le fil que l'on veut comparer
 * @param {Composant} composant Le composant que l'on veut comparer
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions 
 * interne effectuer dans la fonction
 * @returns Un boolean qui dit si le fil a été supprimer du répertoire. Très important si c'est un
 * nouveau fil (voir verifierCouperFil)
 */
function couperFil(fil, composant, actions) {
  let penteFil = Math.abs(fil.pente());
  let horizontal = composant.orientation % PI === 0;
  if ((penteFil == Infinity && !horizontal) || (penteFil == 0 && horizontal)) {
    const index = fils.indexOf(fil);
    let piInBound = composant.inBounds(fil.xi, fil.yi);
    let pfInBound = composant.inBounds(fil.xf, fil.yf);
    let connections = composant.getConnections();
    let borne1 = connections[0];
    let borne2 = connections[1];
    if (piInBound && pfInBound) {
      //supprimer le fil
      fils.splice(index, 1);
      actions.push({ type: SUPPRIMER, objet: fil, index });
      return false;
    } else if (piInBound && !pfInBound) {
      //Raccourcir le fil pour le point initial
      actions.push({
        type: MODIFIER,
        objet: fil,
        changements: [
          { attribut: 'xi', ancienne_valeur: fil.xi, nouvelle_valeur: borne2.x },
          { attribut: 'yi', ancienne_valeur: fil.yi, nouvelle_valeur: borne2.y }
        ]
      });
      fil.xi = borne2.x;
      fil.yi = borne2.y;
    } else if (!piInBound && pfInBound) {
      //raccourcir le fil pour le point final
      actions.push({
        type: MODIFIER,
        objet: fil,
        changements: [
          { attribut: 'xf', ancienne_valeur: fil.xf, nouvelle_valeur: borne1.x },
          { attribut: 'yf', ancienne_valeur: fil.yf, nouvelle_valeur: borne1.y }
        ]
      });
      fil.xf = borne1.x;
      fil.yf = borne1.y;
    } else if (fil.inBoxBounds(composant.x, composant.y)) {
      let newFils = splitFil(fil, actions, borne1, borne2);
      verifierCouperFil(newFils[0], actions);
      verifierCouperFil(newFils[1], actions);
      return false;
    }
  }
  return true;
}

/**
 * Fonctionnalité permettant de colé la position d'un fil avec celle des bornes d'un composant.
 * Cette fonction va spécifiquement mettre à jour la position de chaque fil associé aux bornes
 * d'un composant en prennant em compte la précédente connection qu'il y avait avant le modification
 * du composant
 * @param {Array} borneG Tout les fils qui connecte avec la borne négative du composant
 * @param {Array} borneD Tout les fils qui connecte avec la borne postive du composant
 * @param {object} posReference Les bornes positives et négative précédente. 
 * Cette position sert à trouver quel borne du fil exactement il faut modifier (inital ou final)
 * @param {object} posUpdate Les bornes positives et négative mise-à-jour. Ce sont les valeurs
 * de positions que l'on veut mettre à jour dans les fils
 */
function updateFilPos(borneG, borneD, posReference, posUpdate) {
  let changeFil = (array, a, b) => {
    for (const element of array) {
      if (element.xi == a.x && element.yi == a.y) {
        element.xi = b.x;
        element.yi = b.y;
      } else {
        element.xf = b.x;
        element.yf = b.y;
      }
    }
  }
  changeFil(borneG, posReference[0], posUpdate[0]);
  changeFil(borneD, posReference[1], posUpdate[1]);
}

/**
 * Enregistre dans une liste d'actions les changements effectuer sur les fils en liens avec
 * la fonctionnalité des fils ancré
 * @param {Array} borneG Tout les fils qui connecte avec la borne négative du composant
 * @param {Array} borneD Tout les fils qui connecte avec la borne postive du composant
 * @param {object} posReference Les bornes positives et négative précédente. 
 * Cette position sert à trouver quel borne du fil exactement a été modifier (inital ou final)
 * @param {object} posUpdate Les bornes positives et négative mise-à-jour. Ce sont les valeurs
 * de positions que l'on veut mettre à jour dans les fils
 * @param {Array} actions La liste d'action qui va être enregistrer dans {@link addActions}
 * @see updateFilPos 
 */
function setModificationFilPos(borneG, borneD, posReference, posUpdate, actions) {
  let addActionFil = function (array, a, b, actions) {
    for (const element of array) {
      let leftMod = element.xi == a.x && element.yi == a.y;
      let x = leftMod ? 'xi' : 'xf';
      let y = leftMod ? 'yi' : 'yf';
      actions.push({
        type: MODIFIER,
        objet: element,
        changements: [
          { attribut: x, ancienne_valeur: b.x, nouvelle_valeur: a.x },
          { attribut: y, ancienne_valeur: b.y, nouvelle_valeur: a.y }
        ]
      });
    }
  }
  addActionFil(borneG, posReference[0], posUpdate[0], actions);
  addActionFil(borneD, posReference[1], posUpdate[1], actions);
}


/**
 * Met à jour les positions des noeuds et des connections.
 */
function updateNoeud() {
  noeuds.length = 0;
  let joinElement = fils.concat(components)
  for (const element of joinElement) {
    let connections = getAllConnection(element);
    if (!noeuds.includes(connections.left) && connections.left.connections.length > 1) {
      noeuds.push(connections.left);
    }
    if (!noeuds.includes(connections.right) && connections.right.connections.length > 1) {
      noeuds.push(connections.right);
    }
  }
}

/**
 * Cette fonction est l'équivalent de ajustementAutomatiqueFil, mais pour les composants.
 * Les actions qui peuvent être effectuer sont de remplacer un composant si deux composants
 * sont à la même position (remplacer le plus ancien par le nouveau) et de recouper les fils
 * si besoin (voir couperFil)
 * @param {Composant} composant Le nouveau composant à valider
 * @param {Array} actions La liste d'actions ou l'on va enregistrer les actions interne 
 * effectuer dans la fonction
 */
function ajustementAutomatiqueComposant(composant, actions) {
  let composantSuperpose = components.find(element => element !== composant &&
    element.x == composant.x && element.y == composant.y);
  if (composantSuperpose != null) {
    let index = components.indexOf(composantSuperpose);
    components.splice(index, 1);
    actions.push({ type: SUPPRIMER, objet: composantSuperpose, index });
  }
  for (const fil of fils) {
    if (fil.isPenteConstante())
      couperFil(fil, composant, actions)
  }
  verifierSplitNewComposant(composant, actions);
}