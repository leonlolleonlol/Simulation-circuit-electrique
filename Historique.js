
const MODIFIER = 'modifier';
const CREATE = 'créer';
const DELETE = 'delete';
// Commencer toujours sur une model de ----> typeAction, objet
// Si type d'action est modification ----> typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
// le tablean dans modification est pour avoir plusieurs modification dans un objet


class Historique{
  constructor(){
    this.actions = [];
    this.index = -1;
  }

  addActions(action){
    this.actions.push(action);
    this.index++;
    }
  undo(){
  if(this.index>-1)
  {
  let action = this.actions[this.index];
  this.index--;
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
  let action = this.action[this.index + 1];
  // Enlever toute les actions qui suivent
  this.index++;
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

