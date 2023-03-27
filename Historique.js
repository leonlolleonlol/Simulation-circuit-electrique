
const MODIFIER = 'modifier';
const CREATE = 'créer';
const DELETE = 'delete';
// Commencer toujours sur une model de ----> typeAction, objet
// Si type d'action est modification ----> typeAction, objet, changements:[attribut, ancienne_valeur, nouvelle_valeur]
// le tablean dans modification est pour avoir plusieurs modification dans un objet

class Historique{
  constructor(){
    this.actions = [];
    this.index = 0;
  }
  undo(){
  let action = this.action[index];
  index--;
  if(action.type===CREATE){
    circuit.remove(action.objet);
  }else if(action.type===DELETE){
    circuit.add(action.objet);
  }else if(action.type===MODIFIER){
    let composant = action.objet;
    for(let i = 0; i<action.changements.length;i++){
      Object.defineProperty(composant, action.changements[i].attribut, {value : action.changements[i].ancienne_valeur});
    }
  }
}
  redo(){
  let action = this.action[index + 1];
  // Enlever toute les actions qui suivent
  index++;
  if(action.type===CREATE){
    circuit.add(action.objet);
  }else if(action.type===DELETE){
    circuit.remove(action.objet);
  }else if(action.type===MODIFIER){
    let composant = action.objet;
    for(let i = 0; i<action.changements.length;i++){
      Object.defineProperty(composant, action.changements[i].attribut, {value : action.changements[i].nouvelle_valeur});
    }
  }
}
  }
}
