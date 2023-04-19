const MODIFIER = 'modifier';//typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
const CREATE = 'créer';//typeAction, objet
const DELETE = 'delete';//typeAction,objet
const REPLACE = 'remplacer';//typeAction, objet, ancien_objet
const RESET = 'recommencer';//typeAction,circuit



const undo_list = [];
const redo_list = [];

const limitActions = 100;

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
        if(action.objet.getType()!='fil')
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
        if(action.objet.getType()!='fil'){
        components.splice(components.indexOf(action.objet),1);
        components.splice(action.ancien_objet.index,0,action.ancien_objet.objet);
        }
        else{
          if(action.objet instanceof Array){
            for (let index = action.objet.length - 1; index >=0 ; index--) {
              const fil = action.objet[index];
              fils.splice(components.indexOf(fil.objet), 1);
            }
          }else
            fils.splice(components.indexOf(action.objet), 1);
          if(action.ancien_objet instanceof Array){
            for (let index = action.ancien_objet.length - 1; index >=0 ; index--) {
              const fil = action.ancien_objet[index];
              fils.splice(fil.index,0,fil.objet);
            }
          }else{
            fils.splice(action.ancien_objet.index, 0, action.ancien_objet.objet);
          }
        }
      } else if(action.type === RESET){
        //circuit = action.circuit;
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
        if(action.objet.getType()!='fil')
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
        if(action.objet.getType()!='fil'){
          components.splice(components.indexOf(action.ancien_objet),1)
          components.push(action.objet);
        }else{
          if(action.ancien_objet instanceof Array){
            for (const fil of action.ancien_objet){
              fils.splice(fils.indexOf(fil.objet),1);
            }
          } else{
            fils.splice(fils.indexOf(action.ancien_objet),1);
          }
          if(action.objet instanceof Array){
            for (const fil of action.objet){
              fils.splice(fil.objet.index, 0, fil.objet.objet);
            }
          }else{
            fils.push(action.objet);
          }
          
        }
        
      }else if(action.type === RESET){
        initComponents();
      }
    }
  }
}

function validerAction(action){
  
  if(action.type !== CREATE && action.type !== DELETE && 
     action.type !== MODIFIER && action.type !== REPLACE &&
     action.type !== RESET)
    return false;
  if(action.type === RESET || !(action.objet instanceof Composant || action.objet.getType()==='fil'))
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
  if(action.type === RESET){
    if(!action.circuit instanceof Circuit)
      return false;
  }
  return true;
}

function applyLimitActions(){
  if(undo_list.length > limitActions)
    undo_list.shift();

}
