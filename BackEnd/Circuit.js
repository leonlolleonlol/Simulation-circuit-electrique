/**
 * Contient une suite de composantes en série. S'il y a un noeud, 
 * c'est dans le noeud qu'on retrouvera les circuits en parallèle.
 */
class Circuit{
    /**
     * Initialise toute ce qu'on aura besoin pour les calculs. Si c'est une branche, la variable circuit devient "children" 
     * @param {boolean} premierCircuit cette variable sert à indiquer si c'est cet objet qui contient le circuit au complet.
     * Donc c'est true si ce n'est pas une branche du circuit construit par l'utilisateur.
     */
    constructor(premierCircuit){
        this.premierCircuit = premierCircuit;
        this.circuit = []; //Array de composantes qui sont en série
        this.valide = true;

        //C'est variable sont utile dans le cas où l'instance de cette class est une branche
        this.capaciteEQ = 0;
        this.resistanceEQ = 0;
        
        //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
        this.type;
    }

    ajouterComposanteALaFin(composant){
        this.circuit.push(composant);
    }
    
    //position est l'emplacement de la valeur a modifier, le 0 est le nombre de valeur a modifier et composant est ce qu'on ajoute à la position
    ajouterComposante(composant, position){ 
        this.circuit.splice(position, 0, composant);
    }
    
    retirerComposante(position){
        this.circuit.splice(position, 1);
    }
    
    echangerComposantes(position1, position2){
        let temp1 = circuit[position1];
        let temp2 = circuit[position2];
        if(position1 < position2){
            this.circuit.splice(position1, 1, temp2);
            this.circuit.splice(position2, 1, temp1);
        } else if(position2 < position1){
            this.circuit.splice(position2, 1, temp1);
            this.circuit.splice(position1, 1, temp2);
        }
    }
  
    /**
     * Doit se faire appeler quand il y a une nouvelle connection entre 2 composantes, quand une connection est brisée et
     * quand une valeur dans une composante est modifiée. Elle doit aussi seulement être appellé une fois au début sur la
     * branche principale.
     */
    update(){//Chaque fois qu'il y a un changement dans le circuit
        if(this.premierCircuit){
            this.rearrangerArrayCircuit();
        }
        this.validerCircuit()

        if(this.valide){
            this.trouverEq();
        }
    
    }
    
    /**
     * Change l'ordre des composantes pour que la pile soit à position 0 dans circuit.
     */
    rearrangerArrayCircuit(){
        
    }
    
    /**
     * Regarde s'il y a au moins un chemin possible pour le courant
     */
    validerCircuit(){
        this.valide = true;
    }

    /**
     * Sert à trouver le circuit équivalent en série
     */
    trouverEq(){
        this.trouverTypeDeCircuit();

        switch (this.type){
            case circuitType.seulementR:
                for (let i = 0; i < circuit.length; i++){
                    if(this.circuit[i].getType == composantType.noeudType){
                        this.resistanceEQ += this.circuit[i].resistanceEQ;
                    }else{
                        this.resistanceEQ += this.circuit[i].resistance;
                    }
                }
                break;
            case circuitType.seulementC:
                let capaciteTemp = 0;
                for (let i = 0; i < circuit.length; i++){ 
                    capaciteTemp += 1 / this.circuit[i];
                }
                this.capaciteEQ = 1/capaciteTemp;
                break;
            case circuitType.RC:
                //C'est là que c'est difficile
                break;
        }
    }

    trouverTypeDeCircuit(){
        let circuitR = false;
        let circuitC = false;
        let circuitRC = false;
        for (let i = 0; i < this.circuit.length; i++){ 
            switch(this.circuit[i].getType()){
                case composantType.resisteurType:
                    circuitR = true;
                    break;
                case composantType.condensateurType:
                    circuitC = true;
                    break;
                case composantType.noeudType:
                    switch(this.circuit[i].trouverTypeDeCircuit){
                        case circuitType.seulementR:
                            circuitR = true;
                            break;
                        case circuitType.seulementC:
                            circuitC = true;
                            break;
                        case circuitType.RC:
                            circuitRC = true;
                            break;
                    }
                    this.circuit[i].trouverEq;
                    break;
            }
        }

        if((circuitR && circuitC) || circuitRC){
            this.type = circuitType.RC;
        }else if (circuitC){
            this.type = circuitType.seulementC;
        }else{
            this.type = circuitType.seulementR;
        }
    }

    getType(){
        return this.type;
    }
}


/**
 * C'est objet là ont le même rôle que des enum en java.
 */
let composantType = {
    resisteurType: 75839,
    condensateurType: 98435,
    noeudType: 48134
}
//ces nombres sont choisi au hasard, il faut juste que quand on compare, si le nombre est pareil, on détecte que c'est du même type
let circuitType = {
    seulementR: 29852,
    seulementC: 10854,
    RC: 09842
}
