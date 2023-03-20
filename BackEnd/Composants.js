class Composants {
   
    constructor(courant, tension){
        this.courant = courant;
        this.tension = tension
    }

    bluedabedi(ababa) {
        return ++ababa;
    }
} 
const res = new Composants(10,23.2);
console.log(res.bluedabedi(10))
console.log('Hello Word')


