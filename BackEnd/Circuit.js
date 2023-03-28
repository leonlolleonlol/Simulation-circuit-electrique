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
        this.circuit = []; //Array de composantes
        this.valide = true;

        //C'est variable sont utile dans le cas où l'instance de cette class est une branche
        this.capaciteEQ = 0;
        this.resistanceEQ = 0;
        
        //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
        this.type;
    }

    ajouterComposanteALaFin(composant){
        circuit.push(composant);
    }
    
    //position est l'emplacement de la valeur a modifier, le 0 est le nombre de valeur a modifier et composant est ce qu'on ajoute à la position
    ajouterComposante(composant, position){ 
        circuit.splice(position, 0, composant);
    }
    
    retirerComposante(position){
        circuit.splice(position, 1);
    }
    
    echangerComposantes(position1, position2){
        let temp1 = circuit[position1];
        let temp2 = circuit[position2];
        if(position1 < position2){
            circuit.splice(position1, 1, temp2);
            circuit.splice(position2, 1, temp1);
        } else if(position2 < position1){
            circuit.splice(position2, 1, temp1);
            circuit.splice(position1, 1, temp2);
        }
    }
  
    /**
     * Doit se faire appeler quand il y a une nouvelle connection entre 2 composantes, quand une connection est brisée et
     * quand une valeur dans une composante est modifiée. Elle doit aussi seulement être appellé une fois au début sur la
     * branche principale.
     */
    update(){//Chaque fois qu'il y a un changement dans le circuit
        if(this.premierCircuit){
            rearrangerArrayCircuit();
        }
        validerCircuit()

        if(this.valide){
            trouverEq();
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
        trouverTypeDeCircuit();

        switch (this.type){
            case "seulementR":
                for (let i = 0; i < circuit.length; i++){
                    if(this.circuit[i].getType == "Noeud"){
                        this.resistanceEQ += this.circuit[i].resistanceEQ;
                    }else{
                        this.resistanceEQ += this.circuit[i].resistance;
                    }
                }
                break;
            case "seulementC":
                let capaciteTemp = 0;
                for (let i = 0; i < circuit.length; i++){ 
                    capaciteTemp += 1 / this.circuit[i];
                }
                this.capaciteEQ = 1/capaciteTemp;
                break;
            case "RC":
                //C'est là que c'est difficile
                break;
        }
    }

    trouverTypeDeCircuit(){
        let circuitR = false;
        let circuitC = false;
        for (let i = 0; i < circuit.length; i++){ 
            switch(circuit[i].getType()){
                case "Ampoule": //Une ampoule agie comme une résistance
                case "Résisteur":
                    circuitR = true;
                    break;
                case "Condensateur":
                    circuitC = true;
                    break;
                case "Noeud":
                    circuit[i].trouverEq;
                    break;
            }
        }

        if(circuitR && circuitC){
            this.type = "RC"
        }else if (circuitC){
            this.type = "seulementC"
        }else{
            this.type = "seulementR"
        }
    }

    getType(){
        return this.type;
    }
}
