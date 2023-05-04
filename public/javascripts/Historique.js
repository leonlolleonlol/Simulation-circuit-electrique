//const MODIFIER = 'modifier';//typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
//const CREATE = 'créer';//typeAction, objet
//const DELETE = 'delete';//typeAction, objet , index



const undo_list = [];
const redo_list = [];

const limitActions = 100;

/**
 * Enregistrer une action utilisable pour les fonctionnalités 
 * 'annuler' et 'refaire'
 * @param {*} action Liste d'actions que l'on veut enregistrer pour l'historique
 */
function addActions(action){
  redo_list.length = 0;
  if(action instanceof Array){
    for (const a of action) {
      validerAction(a);
    }
  }else validerAction(action);
  undo_list.push(action);
  applyLimitActions();
}


function undo(){
  if(undo_list.length > 0){
    let actions = undo_list.pop();
    redo_list.push(actions);
    if(!(actions instanceof Array))
      actions = [actions];
    for(const action of actions){
      if(action.type===CREATE){
        if(action.objet.getType()!='fil'){
          components.splice(components.indexOf(action.objet),1);
          //circuit.retirerComposant(action.objet);
        }  
        else
          fils.splice(fils.indexOf(action.objet),1);
        if(selection == action.objet){
          selection = null;
        }
      }else if(action.type===DELETE){
        if(action.objet.getType()!='fil'){
          components.splice(action.index, 0, action.objet);
          //circuit.ajouterComposant(action.objet);
        }
        else
          fils.splice(action.index, 0, action.objet);
        
      }else if(action.type===MODIFIER){
        let composant = action.objet;
        for(changement of action.changements){
          composant[changement.attribut] = changement.ancienne_valeur;
        }
      }
    }
  }
}


function redo(){
  // Enlever toute les actions qui suivent
  if(redo_list.length > 0){
    let actions = redo_list.pop();
    undo_list.push(actions);
    if(!(actions instanceof Array))
      actions = [actions];
    for (const action of actions) {
      if(action.type===CREATE){
        if(action.objet.getType()!='fil'){
          components.push(action.objet);
          //circuit.ajouterComposant(action.objet);
        }
        else
          fils.push(action.objet);
      }else if(action.type===DELETE){
        if(action.objet.getType()!='fil'){
          components.splice(action.index, 1);
          //circuit.ajouterComposant(action.objet);
        }
        else
          fils.splice(action.index, 1);
        if(selection == action.objet){
            selection = null;
          }
      }else if(action.type===MODIFIER){
        let composant = action.objet;
        for(changement of action.changements){
          composant[changement.attribut] = changement.nouvelle_valeur;
        }
      }
    }
  }
}

/**
 * Vérifier si une action est bien construite pour ne pas enregistrer des prochaines
 * erreurs
 * @param {*} action L'action que l'on veut vérifier
 * @throws Une erreur de mauvaise construcution de l'action
 */
function validerAction(action){
  if(action.type !== CREATE && action.type !== DELETE && 
     action.type !== MODIFIER)
    throw new Error('L\'action '+action.type+' n\'est pas recconnus'+
    'comme type d\'action');
  if(!(action.objet instanceof Composant || action.objet.getType()==='fil'))
    throw new Error('La cible du changement n\'est pas préciser');
  if(action.type === MODIFIER){
    if(!action.changements instanceof Array)
      throw new Error('Les changements mentionner dans l\'action devrait'
      +'être un tableau');
    for(changement of action.changements){
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
