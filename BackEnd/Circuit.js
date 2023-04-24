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
        this.presenceBattrie = false;
        this.index = 0;

        this.courant = 0;
        this.charge = 0;

        //C'est variable sont utile dans le cas où l'instance de cette class est une branche
        this.capaciteEQ = 0;
        this.resistanceEQ = 0;
        this.tensionEQ = 0;
        
        //Sert stocker le type de circuit. AKA -> seulement des résistances, seulement des condensateurs ou RC.
        this.type;
    }
    ajouterComposante(composant){
        this.circuit.push(composant);
    }

    //C'est mieux si tu m'envoi un objet composante, ça facilite la suite des chose
    connectComposante(composanteAvant, composanteApres){
        //if(composanteAvant.getTypeCalcul() == composantType.batterieType){print("okkkk")}
        composanteAvant.setProchaineComposante(composanteApres);
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
        
       // this.rearrangerArrayCircuit();
       this.validerCircuit();
        this.tensionEQ = this.circuit[0].tension;
        this.trouverEq();
    }

    validerCircuit(){
        /**
         * Points à valider : 
         * -- présence d'une pile
         * -- est-ce que les fils retourne à la pile
         */
        //cree un boolean
        let element = this.circuit[this.index].getProchaineComposante(); 
        this.trouverPile(this.circuit)
        if(this.premierCircuit){
            //let cpt = 0;
            while(element.getTypeCalcul != composantType.batterieType){//for (cpt != circuit.lenght)
                this.index = this.circuit.indexOf(this.circuit[this.index].getProchaineComposante());// créer une exception dans le cas ou ça trouve pas la composante
                element = this.circuit[this.index].getProchaineComposante();
                //cpt++;
            } 
        }

        
    }


    trouverPile(circuit){
        let element; 
        
        for(let i = 0; i < circuit.length; i++){
            if(circuit[i].getTypeCalcul() == composantType.batterieType){
                this.premierCircuit = true;
                this.presenceBattrie = true;
                this.index = i; //inutile 

                if(i!= 0){// le place à la première place
                    this.echangerComposantes(i,0);
                }
                
            }else if (circuit[i].getTypeCalcul() == composantType.noeudType){
                this.trouverPile(circuit[i].getCircuitNoeud());
            }else if (circuit[i] instanceof Circuit){
               this.trouverPile(circuit[i].circuit);
            }
        }       
    }

    /**
     * Change l'array pour que le circuit soit en série grâce à l'historique. Après cette méthode, le
     * circuit devrait commencer de la pile, puis finir à la composante juste avant la pile.
     */
    rearrangerArrayCircuit(){
        let element; 
        this.validerCircuit();//Quelle méthode faut-il appeler quand on pas de circuit valide.
        if(this.premierCircuit){
            for(let i = 0; i < this.circuit.length; i++){
                element = this.circuit[i].getProchaineComposante();
            }
            
        }
        //Dans noeud creer une methode valider pour prochaine composante
        
            for(let i = 0; i < this.circuit.length; i++){
                // if (noeud) == new circuit
                /*
                if(this.circuit[i].getTypeCalcul == composantType.noeudType){
                    this.circuit[i] = new Circuit(false).ajouterComposante(this.circuit[i]); 
                }
                */

            }
        


        /*
        for(let i = 0; i < this.circuit.length; i++){
            //apartir de la pile on retrace le chemin en utilisant les fil pour définir la prochaine composante
            //if()
          this.circuit[index++] 
           if(true){//le fil donne lieu à 2 différents fils
            
            while(this.circuit[index]){
                index++
            }
        }else{index++}
        } 
        */
    }

    // https://stackoverflow.com/questions/4011629/swapping-two-items-in-a-javascript-array 
    /* 
    swapArrayElements (arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
      }
     */ 
      
      

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
                    this.capaciteEQ = (1/capaciteTemp).round(2);
                    if(this.premierCircuit){
                        this.charge = this.capaciteEQ * this.tensionEQ; 
                        print(this.charge);
                    }
                    this.remplirCondensateursAvecCharge();
                    break;
                case circuitType.RC:
                    //C'est là que c'est difficile
                    //On peut aussi juste dire que le circuit est invalide.
                    print("Circuit RC détecté"); //(rip)
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

    remplirCondensateursAvecCharge(){
        for (let i = 0; i < this.circuit.length; i++){
            if(this.circuit[i].getTypeCalcul() == composantType.condensateurType){
                this.circuit[i].charge = this.charge;
                this.circuit[i].tension = this.charge / this.circuit[i].capacite;
            }else if(this.circuit[i].getTypeCalcul() == composantType.noeudType){
                this.circuit[i].tensionEQ = this.charge / this.capaciteEQ;
                this.circuit[i].remplirCondensateursAvecTension();
            }
        }
    }
}

/**
 * Traverse le circuit pour trouver les mailles de celui-ci (voir lois des mailles ou boucles)
 * @param {Array} composants Liste des composants d'un circuit
 * @param {Array} mailles Liste de mailles qui va enregistrer les mailles au fur et à mesure de
   * l'itération dans la branche ou noeud.
 * @param {Array} maille Maille présentement écrite
 */
function circuitMaille(composants, mailles, maille){
    for (let i = 0; i < composants.length; i++) {
        const element = composants[i];
        if(element.getType()===Noeuds.getType()){
            element.maille(composants, mailles, [...maille], i);
            return;
        }else {
            maille.push(element);
        }
    }
    mailles.push(maille);
}


/**
 * C'est objet là ont le même rôle que des enum en java.
 */
let composantType = {
    resisteurType: 75839,
    condensateurType: 98435,
    noeudType: 48134,
    diodeType: 87931,
    batterieType:34890
}
//ces nombres sont choisi au hasard, il faut juste que quand on compare, si le nombre est pareil, on détecte que c'est du même type
let circuitType = {
    seulementR: 29852,
    seulementC: 10854,
    RC: 90842
}

