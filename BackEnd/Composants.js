class Composants {
   
    constructor(x, y){
        this.x = x;
        this.y = y
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
        this.tension = 10;
    }

    setTension(x){
        this.tension = x;
    }
}
class Switch extends Composants{
}
class Noeuds extends Composants{
}
