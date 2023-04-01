const MODIFIER = 'modifier';
const CREATE = 'créer';
const DELETE = 'delete';
let nb;
let actions;
// Commencer toujours sur une model de ----> typeAction, objet
// Si type d'action est modification ----> typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
// le tablean dans modification est pour avoir plusieurs modification dans un objet


class Historique{
  constructor(){
    actions = [];
    nb=0;
  }
  

  addActions(action){
    actions.push(action);
    nb++;
    }
  undo(){
  if(nb>0)
  {
  let action = actions[nb-1];
  nb--;
  print(action)
  if(action.type===CREATE){
    if(action.objet.type!='fil')
      components.pop(action.objet);
    else
      fils.pop(action.objet);
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
  redo(){
  let action = actions[nb + 1];
  // Enlever toute les actions qui suivent
  nb++;
  if(action.type===CREATE){
    components.add(action.objet);
  }else if(action.type===DELETE){
    components.remove(action.objet);
  }else if(action.type===MODIFIER){
    let composant = action.objet;
    for(let i = 0; i<action.changements.length;i++){
      Object.defineProperty(composant, action.changements[i].attribut, {value : action.changements[i].nouvelle_valeur});
    }
  }
}
  }

