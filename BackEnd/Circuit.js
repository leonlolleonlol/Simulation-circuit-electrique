//let circuit = [new Batterie];
// Le circuit ne possède pas nécessairement une batterie

class Circuit{
    constructor(){
        this.composants = [];// Toutes des branches puisque le circuit est en fait plusieurs circuit ou chaque circuit est représenter par une branche
        
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
        //Une fois au début
    }

    update(temps){
        //Chaque changement dans le circuit
    }
}


