//let circuit = [new Batterie];
// Le circuit ne possède pas nécessairement une batterie

class Circuit{
    constructor(tension){
        this.composants = [];// Toutes des branches puisque le circuit est en fait plusieurs circuit ou chaque circuit est représenter par une branche
        this.tension = tension;
    }
    ajouterComposante(composante){
        this.composants.push(composante);
    }

    retirerComposante(position){
        
    }
    
    connectComposants(Composant1,composant2){
        // C'est ici que les branches vont se rassembler et que la logique de construction de circuit se pass
        // 1. Trouver la branche des deux composants
        // 2. Faire une fusion des deux branches
    }
    start(){ 
        for (let index = 0; index < this.composants.length; index++) {
            let element = this.composants[index];
            print(element);
            element.calculer_equivalence(this.tension);
            
        }
    }

    update(temps){
        print(this);
        //Chaque changement dans le circuit
        this.composants.forEach(element => {
            element.calcul(false,this);
        });
    }
}


