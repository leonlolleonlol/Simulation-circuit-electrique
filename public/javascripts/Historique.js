
const undo_list = [];
const redo_list = [];

const limitActions = 100;// La limite du tableau undo_list

/**
 * Enregistrer une action utilisable pour les fonctionnalités 
 * 'annuler' et 'refaire'. Si l'on veut que plusieurs actions soit exécuter en un seul appel
 * de la fonctionnalité, fournir une liste d'action.
 * @param {*} action Liste d'actions que l'on veut enregistrer pour l'historique. 
 * Peut être une liste.
 */
function addActions(action){
  redo_list.length = 0;
  if(action instanceof Array){
    for (const a of action) {
      validerAction(a);
    }
    action.reverse();
  }else validerAction(action);
  undo_list.push(action);
  applyLimitActions();
}


/**
 * Annuler la dernière action ou liste d'action effectué par l'utilisateur
 */
function undo(){
  if(undo_list.length > 0){
    let actions = undo_list.pop();
    redo_list.push(actions);
    if(!(actions instanceof Array))
      actions = [actions];
    for(const action of actions){
      if(action.type===CREATE){
        if(action.objet.getType()!=FIL){
          components.splice(components.indexOf(action.objet),1);
        } else fils.splice(fils.indexOf(action.objet),1);
        if(selection == action.objet){
          selection = null;
        }
      }else if(action.type===DELETE){
        if(action.objet.getType()!=FIL){
          components.splice(action.index, 0, action.objet);
        }else fils.splice(action.index, 0, action.objet);
        
      }else if(action.type===MODIFIER){
        for(const changement of action.changements){
          action.objet[changement.attribut] = changement.ancienne_valeur;
        }
      }
    }
  }
}


/**
 * Refaire la dernière action ou liste d'action annuler par l'utilisateur
 */
function redo(){
  if(redo_list.length > 0){
    let actions = redo_list.pop();
    undo_list.push(actions);
    if(!(actions instanceof Array))
      actions = [actions];
    for (const action of actions) {
      switch (action.type) {
        case CREATE:
          if(action.objet.getType()!=FIL){
            components.push(action.objet);
          } else fils.push(action.objet);
          break;
        case DELETE:
          if(action.objet.getType()!=FIL){
            components.splice(action.index, 1);
          } else fils.splice(action.index, 1);
          break;
        case MODIFIER:
          for(const changement of action.changements){
            action.objet[changement.attribut] = changement.nouvelle_valeur;
          }
          break;
      }
    }
  }
}

/**
 * Vérifier si une action est bien construite pour ne pas enregistrer des prochaines
 * erreurs. Voici les construction possible:
 *  - type:CREATE, objet:cible
 *  - type:DELETE, objet:cible, index:indexSupression
 *  - type:MODIFIER, objet:cible, 
 *    changements:[{attribut:variable, ancienne_valeur:a, nouvelle_valeur:b},...]
 * @param {*} action L'action que l'on veut vérifier
 * @throws Une erreur de mauvaise construcution de l'action
 */
function validerAction(action){
  if(action.type !== CREATE && action.type !== DELETE && 
     action.type !== MODIFIER)
    throw new Error('L\'action '+action.type+' n\'est pas recconnus'+
    'comme type d\'action');
  if(!(action.objet instanceof Composant || action.objet.getType()===FIL))
    throw new Error('La cible du changement n\'est pas préciser');
  if(action.type === MODIFIER){
    if(!action.changements instanceof Array)
      throw new Error('Les changements mentionner dans l\'action devrait'
      +'être un tableau');
    for(const changement of action.changements){
      if(!changement.attribut instanceof String)
        throw new Error('L\'attribut n\'est pas du bon type: type =' +typeof changement.attribut);
      else if(changement.ancienne_valeur==null || 
        changement.nouvelle_valeur==null)
        throw new Error('Un des attributs pour le changement n\'est pas définis');
    }
  }
}

/**
 * Appliquer une limite sur la mémoire de l'historique
 */
function applyLimitActions(){
  if(undo_list.length > limitActions)
    undo_list.shift();
}

/**
 * Remet à zéro l'historique d'action
 */
function resetHistorique() {
  undo_list.length = 0;
  redo_list.length = 0;
}
