class Branche {
  constructor() {
    // Tout les composants
    this.children = [];
    // Résultat simplifcation circuit équivalent
    this.resistance = 0;
    this.capacite = 0;
    // Résulat des calculs pendant la simulation
    this.charge = 0;
    this.courant = 0;
    this.tension = 0;
  }
  // boolean paralele: Information si la branche précédente est en
  // paralèle
  // Composant composant: composant parent à cette branche.Souvent un groupe 
  // de branche
  calcul(paralele, composant) {
    if (this.resistance != 0) {
      if (paralele) {
        this.tension = composant.tension;
        this.courant = this.tension / this.resistance;
      } else {
        this.courant = composant.courant;
        this.tension = this.resistance * this.courant;
      }
    }
    if (this.capacite != 0) {
      if (paralele) {
        this.tension = composant.tension;
        this.charge = this.capacite * this.tension;
      } else {
        this.charge = composant.charge;
        this.tension = this.charge / this.capacite;
      }
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].calcul(false,this);
    }
  }
  getType() {
    return "branche";
  }

  calculer_equivalence(tension_circuit) {
    let resistancePart = [];
    let condensateurPart = [];
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].getType() == "Résisteur") {
        resistancePart.push(this.children[i].resistance);
      } else if (this.children[i].getType() == "Condensateur") {
        condensateurPart.push(this.children[i].capacite);
      } else if (this.children[i].getType() == "Group") {
        this.children[i].calculer_equivalence();
        resistancePart.push(this.children[i].resistance);
        resistancePart.push(this.children[i].capacite);
      }
    }
    for (let i = 0; i < resistancePart.length; i++)
      this.resistance += resistancePart[i];
    if (condensateurPart.length != 0) {
      let cap = 0;
      for (let i = 0; i < condensateurPart.length; i++)
        cap += 1 / condensateurPart[i];
      this.capacite = 1 / cap;
    }
  }
}
// Le groupe de branche représente tout branche en parralèle dans notre 
// circuit
class GroupeBranche {
  constructor() {
    // Tout les composants
    this.children = [];
    // Résumer des valeurs du circuit équivalent
    this.resistance = 0;
    this.capacite = 0;
    // Valeurs calculer pendant l'animation
    this.charge = 0;
    this.courant = 0;
    this.tension = 0;
  }

  // Fonction appeler pour simplifier le circuit au maximum
  calculer_equivalence() {
    // Il y a des résistances et condensateur en parralèle jusqu'à 
    // preuve du contraire
    let isParalleleResistance = true;
    let isParalleleCondensateur = true;

    //itération sur notre branche
    for (let i = 0; i < this.children.length; i++) {
      let element = this.children[i];
      element.calculer_equivalence();
      if (element.resistance == 0) {
        isParalleleResistance = false;
      }
      if (element.capacite == 0) {
        isParalleleCondensateur = false;
      }
    }
    if (isParalleleResistance) {
      let res = 0;
      for (let i = 0; i < this.children.length; i++)
        res += 1 / this.children[i].resistance;
      this.resistance = 1 / res;
    }
    else{
      //else à vérifier
      for (let i = 0; i < this.children.length; i++)
        this.resistance += this.children[i].resistance;
    }
    if (isParalleleCondensateur) {
      for (let i = 0; i < this.children.length; i++)
        this.capacite += this.children[i].capacite;
    }else{
      //else à vérifier
      for (let i = 0; i < this.children.length; i++)
        this.capacite += this.children[i].capacite;
    }
  }
  // fonction appelé pour savoir 
  // composant: Composant parent qui permet d'obtenir les valeurs importantes
  calcul(paralele,composant) {

    // Pour appliquer les formules, il doit bien entendu avoir une résistance ou 
    // une charge de condensateur. 
    // Vérification de bug de circuit nécéssaire
    if (this.resistance != 0) {
      if (paralele) {
        // formule résistance en paralèlle
        this.tension = composant.tension;
        this.courant = this.tension / this.resistance;
      } else {
        this.courant = composant.courant;
        this.tension = this.resistance * this.courant;
      }
    }
    if (this.capacite != 0) {
      if (paralele) {
        // formule pour condensateur en parralèle
        this.tension = composant.tension;
        this.charge = this.capacite * this.tension;
      } else {
        // formule condensateur en série
        this.charge = composant.charge;
        this.tension = this.charge / this.capacite;
      }
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].calcul(true, this);
    }
  }
  getType() {
    return "Group";
  }
}
