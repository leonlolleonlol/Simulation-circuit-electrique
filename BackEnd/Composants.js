class Composant {

  constructor(courant, tension){
      // on crée automatiquement une classe de tension
      this.courant = courant;
      this.tension = tension;
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

class Resisteur{
  constructor(resistance) {
    this.resistance = resistance;
    this.courant = 0;
    this.tension = 0;
  }
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
  getType() {
    return "Résisteur";
  }
}

class Condensateur{
  constructor(capacite) {
    this.capacite = capacite;
    this.charge = 0;
    this.tension = 0;
    this.courant = 0;
  }
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
  getType() {
    return "Condensateur";
  }
}

class Diode extends Composant{
  constructor(circuit){
      super(circuit, courant, tension);
      this.R = R;
  }
  calcul(){

  }
}
class Ampoule extends Composant{
  constructor(circuit){
      super(circuit, courant, tension);
      this.R = R;
  }
  calcul(){

  }
}
class Batterie extends Composant{
  constructor(){
      tension = 10;
  }
  calcul(){

  }

  setTension(x){
      this.tension = x;
  }
}


class Switch extends Composant {

}

/**
 * C'est dans cette class qu'on va faire les calculs pour les circuits en parallèle.
 */
class Noeuds extends Composant {
  constructor(courant, tension){
    super(courant, tension)
    this.circuitsEnParallele = []; //Array de Circuit

    //C'est variable sont utile dans le cas où l'instance de cette class est une branche
    this.capaciteEQ = 0;
    this.resistanceEQ = 0;
  }
 /**
  * Sert à trouver le circuit équivalent en série
  */
 trouverEq(){
    for (let i = 0; i < circuitsEnParallele.length; i++){ 
      this.circuitsEnParallele[i].trouverEq();
    }

    let typeDeCircuit = this.trouverTypeDeCircuit();

    
    switch (typeDeCircuit){
        case "seulementR":
          let resistancetemp = 0;
            for (let i = 0; i < circuitsEnParallele.length; i++){ 
                resistancetemp += 1 / this.circuit[i].resistanceEQ;
            }
            this.resistanceEQ = 1 / resistanceTemp;
            break;
        case "seulementC":
            for (let i = 0; i < circuitsEnParallele.length; i++){ 
              this.capaciteEQ += this.circuit[i];
            }
            break;
        case "RC":
            //C'est là que c'est difficile
            break;
    }
  }

  trouverTypeDeCircuit(){
    let circuitR = false;
    let circuitC = false;

    for (let i = 0; i < circuitsEnParallele.length; i++){ 
        switch(circuitsEnParallele[i].getType()){
            case "seulementR":
                circuitR = true;
                break;
            case "seulementC":
                circuitC = true;
                break;
        }
    }

    if(circuitR && circuitC){
        this.type = "RC"
    }else if (circuitC){
        this.type = "seulementC"
    }else{
        this.type = "seulementR"
    }
    return this.type;
  }

  getType() {
    return "Noeud";
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

