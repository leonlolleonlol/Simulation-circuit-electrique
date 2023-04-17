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

        this.courant = 0;
        this.charge = 0;

        //C'est variable sont utile dans le cas où l'instance de cette class est une branche
        this.capaciteEQ = 0;
        this.resistanceEQ = 0;
        this.tensionEQ = 0;
        
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
            this.tensionEQ = this.circuit[0].tension;
        }
        this.trouverEq();
        
    }
    /**
     * Change l'array pour que le circuit soit en série grâce à l'historique. Après cette méthode, le
     * circuit devrait commencer de la pile, puis finir à la composante juste avant la pile.
     */
    rearrangerArrayCircuit(){
        let index
        for(){
            /**apartir de la pile on retrace le chemin en utilisant les fil pour définir la prochaine com*/
          this.circuit[index++] 
           if(true){//le fil donne lieu à 2 différents fils
            //étape 1 : fil 1 =
            /** on se retouvre dans un noeud*/
            while(this.circuit[index]){
                index++
            }
        }else{index++}
        }
             
       
        
    }

    /**
     * Sert à trouver le circuit équivalent en série
     */
    trouverEq(){
        this.trouverTypeDeCircuit();
        if(this.valide){
            switch (this.type){
                case circuitType.seulementR:
                    for (let i = 0; i < this.circuit.length; i++){
                        if(this.circuit[i].getTypeCalcul() == composantType.noeudType){
                            this.resistanceEQ += this.circuit[i].resistanceEQ;
                        }else if (this.circuit[i].getTypeCalcul() == composantType.resisteurType){
                            this.resistanceEQ += this.circuit[i].resistance;
                        }
                    }
                    if(this.premierCircuit){
                        this.courant = this.tensionEQ / this.resistanceEQ;
                    }
                    this.remplirResisteursAvecCourant();
                    //TODO remplir les valeurs dans chaque résistances
                    break;
                case circuitType.seulementC:
                    let capaciteTemp = 0;
                    for (let i = 0; i < this.circuit.length; i++){ 
                        if(this.circuit[i].getTypeCalcul() == composantType.noeudType){
                            capaciteTemp += 1 / this.circuit[i].capaciteEQ;
                        }else if (this.circuit[i].getTypeCalcul() == composantType.condensateurType){
                            capaciteTemp += 1 / this.circuit[i].capacite;
                        }
                    }
                    this.capaciteEQ = 1/capaciteTemp;
                    if(this.premierCircuit){
                        this.charge = this.capaciteEQ * this.tensionEQ; 
                    }
                    //TODO remplir les valeurs dans chaque Condensateur
                    break;
                case circuitType.RC:
                    //C'est là que c'est difficile
                    //On peut aussi juste dire que le circuit est invalide.
                    alert("Circuit RC détecté"); //(rip)
                    break;
            }
    
            if(this.premierCircuit){
                print("CapaciteEQ: " + this.capaciteEQ);
                print("ResistanceEQ: " + this.resistanceEQ);
            }
        } else{
            if(this.premierCircuit){
                print("Pas de chemin pour le courant");
            }
        }
        
    }

    /**
     * Sert à trouver si le circuit contient seulement des Résistances, seulement des Condensateurs ou contient les deux. Devrait
     * changer la variable "type" en le type du circuit.
     */
    trouverTypeDeCircuit(){
        let circuitR = false;
        let circuitC = false;
        let circuitRC = false;
        for (let i = 0; i < this.circuit.length; i++){ 
            switch(this.circuit[i].getTypeCalcul()){
                case composantType.resisteurType:
                    circuitR = true;
                    break;
                case composantType.condensateurType:
                    circuitC = true;
                    break;
                case composantType.noeudType:
                    this.circuit[i].trouverEq();
                    switch(this.circuit[i].type){
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
                    break;
                case composantType.diodeType:
                    if(this.circuit[i].orientation == "wrong"){
                        this.valide = false;
                    }
            }
        }
        if((circuitR && circuitC) || circuitRC){
            this.type = circuitType.RC;
            //Même chose que : this.type = 09842;
        }else if (circuitC){
            this.type = circuitType.seulementC;
        }else{
            this.type = circuitType.seulementR;
        }
    }

    getTypeCalcul(){
        return this.type;
    }

    remplirResisteursAvecCourant(){

        for (let i = 0; i < this.circuit.length; i++){
            if(this.circuit[i].getTypeCalcul() == composantType.resisteurType){
                
                this.circuit[i].courant = this.courant;
                this.circuit[i].tension = this.courant * this.circuit[i].resistance;
            }else if(this.circuit[i].getTypeCalcul() == composantType.noeudType){
                this.circuit[i].tensionEQ = this.courant * this.circuit[i].resistanceEQ;
                this.circuit[i].remplirResisteursAvecDifTension();
            }
        }
    }
}

/**
 * C'est objet là ont le même rôle que des enum en java.
 */
let composantType = {
    resisteurType: 75839,
    condensateurType: 98435,
    noeudType: 48134,
    diodeType: 87931
}
//ces nombres sont choisi au hasard, il faut juste que quand on compare, si le nombre est pareil, on détecte que c'est du même type
let circuitType = {
    seulementR: 29852,
    seulementC: 10854,
    RC: 90842
}
