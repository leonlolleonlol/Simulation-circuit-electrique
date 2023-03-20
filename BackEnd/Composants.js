class Composant {

    constructor(circuit, courant, tension){
        // on crée automatiquement une classe de tension
        this.circuit = circuit;
        this.courant = courant;
        this.tension = tension;
    }
    calcul(){
        throw console.error();
    }
} 

class Resistance extends Composant{
    constructor(circuit, courant, tension, R){
        super(circuit, courant, tension);
        this.R = R;
    }

    calcul(){
        calculCourant();//mettre la tension équivalente
    }

    calculCourant(tension_equ){
        // Todo formule
    }

}
class Condensateur extends Composant{
    constructor(circuit, courant, tension, R){
        super(circuit, courant, tension);
        this.R = R;
    }
    calcul(){

    }

}
class Diode extends Composants{
    constructor(circuit){
        super(circuit, courant, tension);
        this.R = R;
    }
    calcul(){

    }
}
class Ampoule extends Composants{
    constructor(circuit){
        super(circuit, courant, tension);
        this.R = R;
    }
    calcul(){

    }
}
class Batterie extends Composants{
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

