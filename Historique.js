const MODIFIER = 'modifier';
const CREATE = 'créer';
const DELETE = 'delete';
// Commencer toujours sur une model de ----> typeAction, objet
// Si type d'action est modification ----> typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
// le tablean dans modification est pour avoir plusieurs modification dans un objet


let undo_list = [];
let redo_list = [];
exports.CREATE = CREATE;
exports.undo_list = undo_list;
exports.addActions = function addActions(action){
  if(redo_list.length!=0)
    redo_list = [];
  undo_list.push(action);
  }
  function undo(){
  if(undo_list.length > 0){
  let action = undo_list.pop();
  redo_list.push(action);
  if(action.type===CREATE){
    if(action.objet.type!='fil')
      components.pop();
    else
      fils.pop();
  }else if(action.type===DELETE){
    components.push(action.objet);
  }else if(action.type===MODIFIER){
    let composant = action.objet;
    for(let i = 0; i<action.changements.length;i++){
      Object.defineProperty(composant, action.changements[i].attribut, {value : action.changements[i].ancienne_valeur});
    }
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
    for(let i = 0; i<action.changements.length;i++){
      Object.defineProperty(composant, action.changements[i].attribut, {value : action.changements[i].nouvelle_valeur});
    }
  }
}
}

