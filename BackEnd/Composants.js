class Composant {

    constructor(circuit, courant, tension){
        // on crée automatiquement une classe de tension
        this.circuit = circuit;
        this.courant = courant;
        this.tension = tension;
    }
    calcul(paralele, composant){
        throw console.error();
    }
} 

class Resisteur extends Composant{
  constructor(resistance) {
    this.resistance = resistance;
    this.courant = 0;
    this.tension = 0;
  }
  calcul(paralele, composant) {
    if (paralele) {
      this.tension = composant.tension;
      this.calculCourant();
    } else {
      this.courant = composant.courant;
      this.calculTension();
    }
    //calcul_Valeurs(paralele, this, courant, tension);
  }
  calculTension() {
    this.tension = this.resistance * this.courant;
  }

  calculCourant() {
    this.courant = this.tension / this.resistance;
  }

  getType() {
    return "Résisteur";
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

class Condensateur extends Composant{
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
class Noeuds extends Composant {
}

