const MODIFIER = 'modifier';//typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
const CREATE = 'créer';//typeAction, objet
const DELETE = 'delete';//typeAction,objet
const REPLACE = 'remplacer';//typeAction, objet, ancien_objet



const undo_list = [];
const redo_list = [];

const limitActions = 100;

function addActions(action){
  redo_list.length = 0;
  undo_list.push(action);
  applyLimitActions();
}
function undo(){
  if(undo_list.length > 0){
    let action = undo_list.pop();
    redo_list.push(action);
    if(action.type===CREATE){
      if(action.objet.type!='fil')
        components.splice(components.indexOf(action.objet),1);
      else
        fils.pop();
    }else if(action.type===DELETE){
      components.push(action.objet);
    }else if(action.type===MODIFIER){
      let composant = action.objet;
      for(changement of action.changements){
        composant[changement.attribut] = changement.ancienne_valeur;
      }
    } else if(action.type===REPLACE){
        composants.splice(composants.indexOf(action.nouvel_objet),1)
        composants.push(action.ancien_objet);
    }
  }
}
function redo(){
  // Enlever toute les actions qui suivent
  if(redo_list.length > 0){
    let action = redo_list.pop();
    undo_list.push(action);
    if(action.type===CREATE){
      if(action.objet.type!='fil')
        components.push(action.objet);
      else
        fils.push(action.objet);
    }else if(action.type===DELETE){
      components.pop();
    }else if(action.type===MODIFIER){
      let composant = action.objet;
      for(changement of action.changements){
        composant[changement.attribut] = changement.nouvelle_valeur;
      }
    }else if(action.type === REPLACE){
      composants.splice(composants.indexOf(action.ancien_objet),1)
      composants.push(action.nouvel_objet);
    }
  }
}

function validerAction(action){

  if(action.type !== CREATE && action.type !== DELETE && action.type !== MODIFIER && action.type !== REPLACE)
    return false;
  if(!(action.objet instanceof Composant || action.objet.getType()==='fil'))
    return false;
  if(action.type === MODIFIER){
    if(!action.changements instanceof Array)
      return false;
    for(changement of action.changements){
      if(!changement.attribut instanceof String ||
          changement.ancienne_valeur==null || 
          changement.nouvelle_valeur==null)
        return false;
    }
  }
  if(action.type === REPLACE){
    if(!action.ancien_objet instanceof Composant)
      return false;
  }
  return true;
}

function applyLimitActions(){
  if(undo_list.length > limitActions)
    undo_list.shift();


