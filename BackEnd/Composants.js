class Composants {

    constructor(courant){
        // on crée automatiquement une classe de tension
        
        this.courant = courant
        this.tension = Tension()
        this.composantesCircuits = {}
    }
    
} 

class Resisteur extends Composants{
}
class Condensateur extends Composants{
}
class Diode extends Composants{
}
class Ampoule extends Composants{
}
class Batterie extends Composants{
}
class Switch extends Composants{
}
class Noeuds extends Composants{
}

