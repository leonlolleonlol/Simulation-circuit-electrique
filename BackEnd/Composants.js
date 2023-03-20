class Composants {

    constructor(courant){
        // on crée automatiquement une classe de tension
        
        this.courant = courant
        this.tension = Tension()
        this.composantesCircuits = {}
    }
    
} 

class Resistance extends Composants{
    constructor(courant, tension, R){
        super(courant, tension);
        this.R = R;
    }

    calculTension(){
        this.tension = this.courant * this.R;
    }

}
class Condensateur extends Composants{

}
class Diode extends Composants{
}
class Ampoule extends Composants{
}
class Batterie extends Composants{
    constructor(){
        tension = 10;
    }

    setTension(x){
        this.tension = x;
    }
}
class Switch extends Composants{
}
class Noeuds extends Composants{
}

