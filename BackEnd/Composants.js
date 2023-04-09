class Composant {

  constructor(){
      // on crée automatiquement une classe de tension
      this.courant = 0;
      this.tension = 0;
  }
  // Cette méthode est appelé à chaque fois que l'on
  // veut calculer la tension et la différence de pottentiel d'un 
  // composant. Les information disponible sont la branche (composant) et 
  //si notre composant est en paralèle ou en série
  calcul(paralele, composant){
      throw console.error();//todo préciser l'erreur
  }
  getType() {
    throw console.error();//todo préciser l'erreur
  }
} 

class Resisteur extends Composant{
  constructor(resistance) {
    super();
    this.resistance = resistance;
  }
  /*
  calcul(paralele, composant) {
    print(this);
    if (paralele) {
      this.tension = composant.tension;
      this.calculCourant();
    } else {
      this.courant = composant.courant;
      this.calculTension();
    }
    //calcul_Valeurs(paralele, this, courant, tension);
  }
  */
  getType() {
    return composantType.resisteurType;
  }
}

class Condensateur extends Composant{
  constructor(capacite) {
    super();
    this.capacite = capacite;
    this.charge = 0;
  }
  /*
  calcul(paralele, composant) {
    this.courant = composant.courant;
    if (paralele) {
      this.tension = composant.tension;
      this.calculCharge();
    } else {
      this.charge = composant.charge;
      this.calculTension();
    }
    //calcul_Valeurs(paralele, this, courant, tension);
  }
  calculCharge() {
    this.charge = this.capacite * this.tension;
  }
  calculTension() {
    this.tension = this.charge / this.capacite;
  }
  */
  getType() {
    return composantType.condensateurType;
  }
}

class Diode extends Composant{
  constructor(circuit){
      super();
      this.R = R;
  }
  calcul(){

  }
}
class Ampoule extends Composant{
  constructor(){
      super();
  }
  calcul(){

  }

  getType() {
    return composantType.resisteurType;
  }
}
class Batterie{
  constructor(tension){
  
    this.tension = tension;
  }
  getType() {
    return null;
  }
}


class Switch extends Composant {

}

/**
 * C'est dans cette class qu'on va faire les calculs pour les circuits en parallèle.
 */
class Noeuds extends Composant {
  constructor(){
    super()
    this.circuitsEnParallele = []; //Array de Circuit qui sont en parallèle

    //C'est variable sont utile pour calculer l'équivalence du noeud
    this.capaciteEQ = 0;
    this.resistanceEQ = 0;
    this.tensionEQ = 0;

    //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
    this.type;
  }

  ajouterCircuitEnParallele(composant){
    this.circuitsEnParallele.push(composant);
  }

  retirerCircuit(position){
      this.circuitsEnParallele.splice(position, 1);
  }

 /**
  * Sert à trouver le circuit équivalent en série
  */
 trouverEq(){
    for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
      this.circuitsEnParallele[i].trouverEq();
    }

    this.trouverTypeDeCircuit();
    
    switch (this.type){
        case circuitType.seulementR:
            let resistanceTemp = 0;
            for (let i = 0; i < this.circuitsEnParallele.length; i++){
              resistanceTemp += 1 / this.circuitsEnParallele[i].resistanceEQ;
            }
            this.resistanceEQ = 1 / resistanceTemp;
            
            break;
        case circuitType.seulementC:
            for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
              this.capaciteEQ += this.circuitsEnParallele[i].capaciteEQ;
            }
            break;
        case circuitType.RC:
            //C'est là que c'est difficile
            break;
    }

  }

  trouverTypeDeCircuit(){
    let circuitR = false;
    let circuitC = false;

    for (let i = 0; i < this.circuitsEnParallele.length; i++){ 
        switch(this.circuitsEnParallele[i].getType()){
            case circuitType.seulementR:
                circuitR = true;
                break;
            case circuitType.seulementC:
                circuitC = true;
                break;
        }
    }

    if(circuitR && circuitC){
        this.type = circuitType.RC;
    }else if (circuitC){
        this.type = circuitType.seulementC;
    }else{
        this.type = circuitType.seulementR
    }
  }

  getType() {
    return composantType.noeudType;
  }

  remplirResisteursAvecDifTension(){
    for (let i = 0; i < this.circuitsEnParallele.length; i++){
      if(this.circuit[i].getType == circuitType.seulementR){
        this.circuitsEnParallele[i].courant = this.tensionEQ / this.resistanceEQ;
        this.circuitsEnParallele[i].remplirResisteursAvecCourant();
      }else if(this.circuit[i].getType = composantType.noeudType){
        this.circuitsEnParallele[i].tensionEQ = this.tensionEQ;
        this.circuitsEnParallele[i].remplirResisteursAvecDifTension();
      }
    }
  }
}

/*function calcul_Valeurs(paralele, composant, courant, tension, charge) {
if (paralele) {
  composant.tension = tension;
  if (composant.getType() == "Résisteur") calcul_courrant_R(composant);
  else if (composant.getType() == "Condensateur") calcul_charge_C(composant);
  else {
    calcul_courrant_R(composant);
    calcul_charge_C(composant);
  }
} else {
  composant.courant = courant;
  if (composant.getType() == "Résisteur") {
    composant.courant = courant;
    calcul_tension_R(composant);
  } else if (composant.getType() == "Condensateur")
    calcul_tension_C(composant);
  else {
    composant.courant = courant;
    composant.charge = charge;
    calcul_tension_R(composant);
    calcul_tension_C(composant);
  }
}
}
function calcul_courrant_R(composant) {
composant.courant = composant.tension / composant.resistance;
}

function calcul_tension_R(composant) {
composant.tension = composant.resistance * composant.courant;
}
function calcul_charge_C(composant) {
composant.charge = composant.capacite * composant.tension;
}

function calcul_tension_C(composant) {
composant.tension = composant.charge / composant.capacite;
}*/

