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
    constructor(){
        this.contientPile;
        this.circuit = []; //Array de composantes qui sont en série
        this.valide = true;
        this.presenceBatterie = false;
        this.index = 0;
        this.arrangerC = false;

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

    connectComposante(composanteAvant, composanteApres){
        composanteAvant.prochaineComposante.push(composanteApres);
        composanteApres.composantePrecedente.push(composanteAvant);
    }
    
    retirerComposante(position){
        this.circuit.splice(position, 1);
    }
    
    // https://stackoverflow.com/questions/4011629/swapping-two-items-in-a-javascript-array  
    echangerComposantes (indexA, indexB) {
        var temp = this.circuit[indexA];
        this.circuit[indexA] = this.circuit[indexB];
        this.circuit[indexB] = temp;
    }
  
    /**
     * Doit se faire appeler quand il y a une nouvelle connection entre 2 composantes, quand une connection est brisée et
     * quand une valeur dans une composante est modifiée. Elle doit aussi seulement être appellé une fois au début sur la
     * branche principale.
     */
    update(){//Chaque fois qu'il y a un changement dans le circuit
        this.trouverPile();
        this.circuit = this.rearrangerArrayCircuit(this.circuit[0], false).circuit;
        this.tensionEQ = this.circuit[0].tension;
        this.trouverEq();
    }

    /**
     * Met la pile à la première position du circuit
     */
    trouverPile(){
        for(let i = 0; i < this.circuit.length; i++){
            if(this.circuit[i].getType() == BATTERIE){   
                this.contientPile = true;
                if(i!= 0){
                    this.echangerComposantes(i, 0);
                }       
            }
        }
    }

    /**
     * La méthode regarde les connections entre les composantes et les assemblent correctement pour les calculs.
     * @param {*} debutComposant 
     * C'est la composant ou le réassemblage va commencer. Si c'est la première fois que la méthode est appelé, la pile doit être mise ici.
     * @param {*} insideNoeud 
     * Indique si la méthode est appellé dans un noeud. Si c'est la première fois que la méthode est appelé, ça doit être false.
     * @returns
     * Retourn une instance de la class Circuit qui contient le circuit réarrangé.
     */
    rearrangerArrayCircuit(debutComposant, insideNoeud){
        let nouvC = new Circuit();
        do{
            if(debutComposant.dejaPasser == false){
                if(!(debutComposant.prochaineComposante.length < 2)){
                    for(let i = 0; i < debutComposant.prochaineComposante.length; i++){
                        debutComposant.ajouterComposante(this.rearrangerArrayCircuit(debutComposant.prochaineComposante[i], true));
                    } 
                }
                nouvC.ajouterComposante(debutComposant); 
                debutComposant.dejaPasser = true;
            }
            debutComposant = debutComposant.getProchaineComposante(); 
        }while((debutComposant.composantePrecedente.length < 2 || !insideNoeud) 
            && !(debutComposant.getProchaineComposante().getType() == BATTERIE));
        
        if(!insideNoeud){
            nouvC.ajouterComposante(debutComposant);
        }
        return nouvC;
    }

    

    arrange(circuit){
        let nouvCircuit = [];
        nouvCircuit[0] = circuit[0];
            for(let i = 1; i < circuit.length; i++){
                nouvCircuit[i] = circuit[i - 1].getProchaineComposante();            
            }
            circuit = nouvCircuit;
    }

    /**
     * Sert à trouver le circuit équivalent en série
     */
    trouverEq(){
        this.trouverTypeDeCircuit();
        if(this.valide){
            switch (this.type){
                case SEULEMENTR:
                    for (let i = 0; i < this.circuit.length; i++){
                        if(this.circuit[i].getType() == NOEUD){
                            this.resistanceEQ += this.circuit[i].resistanceEQ;
                        }else if (this.circuit[i].getType() == RESISTEUR){
                            this.resistanceEQ += this.circuit[i].resistance;
                        }
                    }
                    if(this.contientPile){
                        this.courant = this.tensionEQ / this.resistanceEQ;
                    }
                    this.remplirResisteursAvecCourant();
                
                    break;
                case SEULEMENT:
                    let capaciteTemp = 0;
                    for (let i = 0; i < this.circuit.length; i++){ 
                        if(this.circuit[i].getType() == NOEUD){
                            capaciteTemp += 1 / this.circuit[i].capaciteEQ;
                        }else if (this.circuit[i].getType() == CONDENSATEUR){
                            capaciteTemp += 1 / this.circuit[i].capacite;
                        }
                    }
                    this.capaciteEQ = (1/capaciteTemp).round(2);
                    if(this.contientPile){
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
    
            if(this.contientPile){
                print("CapaciteEQ: " + this.capaciteEQ);
                print("ResistanceEQ: " + this.resistanceEQ);
            }
        } else{
            if(this.contientPile){
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
            switch(this.circuit[i].getType()){
                case RESISTEUR:
                    circuitR = true;
                    break;
                case CONDENSATEUR:
                    circuitC = true;
                    break;
                case NOEUD:
                    this.circuit[i].trouverEq();
                    switch(this.circuit[i].type){
                        case SEULEMENTR:
                            circuitR = true;
                            break;
                        case SEULEMENT:
                            circuitC = true;
                            break;
                        case circuitType.RC:
                            circuitRC = true;
                            break;
                    }
                    break;
                case DIODE:
                    if(this.circuit[i].orientation == "wrong"){
                        this.valide = false;
                    }
            }
        }
        if((circuitR && circuitC) || circuitRC){
            this.type = circuitType.RC;
            //Même chose que : this.type = 09842;
        }else if (circuitC){
            this.type = SEULEMENTC;
        }else{
            this.type = SEULEMENTR;
        }
    }

    getType(){
        return CIRCUIT;
    }

    getTypeDeCircuit(){
        return this.type;
    }

    remplirResisteursAvecCourant(){
        for (let i = 0; i < this.circuit.length; i++){
            if(this.circuit[i].getType() == RESISTEUR){   
                this.circuit[i].courant = this.courant;
                this.circuit[i].tension = this.courant * this.circuit[i].resistance;
            }else if(this.circuit[i].getType() == NOEUD){
                this.circuit[i].tensionEQ = this.courant * this.circuit[i].resistanceEQ;
                this.circuit[i].remplirResisteursAvecDifTension();
            }
        }
    }

    remplirCondensateursAvecCharge(){
        for (let i = 0; i < this.circuit.length; i++){
            if(this.circuit[i].getType() == CONDENSATEUR){
                this.circuit[i].charge = this.charge;
                this.circuit[i].tension = this.charge / this.circuit[i].capacite;
            }else if(this.circuit[i].getType() == NOEUD){
                this.circuit[i].tensionEQ = this.charge / this.capaciteEQ;
                this.circuit[i].remplirCondensateursAvecTension();
            }
        }
    }

    getCircuit(){
        return this.circuit;
    }
    setSymbol(symbole){
        this.symbole = symbole;
        for (const enfant of this.circuit) {
            enfant.symbole = symbole;
        }
    }

    /**
     * Permet de trouver le courrant de chaque circuit selon les lois
     * de kirchhoff
     */
    solveCourrantkirchhoff(){
        let circuits = [];
        this.getCircuits(circuits);
        let dictCourrant = new Map();
        for (let i = 0; i < circuits.length; i++) {
            const element = circuits[i];
            element.setSymbol('i'+(i+1));
            dictCourrant.set('i'+(i+1), element);
        }
        let equations = [];
        this.noeudEq(equations);
        let mailles = [];
        circuitMaille(this.circuit, mailles,[], false, -1);
        for (const maille of mailles) {
            let equation = '0 = '+maille[0].element.getEq(maille[0].sens);
            for (let index = 1; index < maille.length; index++) {
                const obj = maille[index];
                equation +=' + '+obj.element.getEq(obj.sens);
            }
            print(equation)
            equations.push(equation);
        }
        print(equations);
        nerdamer.set('SOLUTIONS_AS_OBJECT', true)
        let reponse = nerdamer.solveEquations(equations);
        for (const symbole in reponse){
            dictCourrant.get(symbole).courrant = reponse[symbole];
        }

    }

    noeudEq(equations){
        for (const element of this.circuit) {
            if(element.getType() == NOEUD){
                let equation = this.symbole +' = ' + element.circuitsEnParallele[0].symbole;
                for (let index = 1; index < element.circuitsEnParallele.length; index++) {
                    const c = element.circuitsEnParallele[index];
                    equation +=' + '+c.symbole
                    c.noeudEq(equations);
                }
                equations.push(equation);
            }
        }
    }

    getCircuits(circuits){
        circuits.push(this);
        for (const element of this.circuit) {
            if(element.getType() == NOEUD){
                for (const branch of element.circuitsEnParallele) {
                    branch.getCircuits(circuits);
                }
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
function circuitMaille(composants, mailles, maille, inverse, indexSeparate){
    for (let i = 0; i < composants.length; i++) {
        const element = composants[i];
        if(element.getType()===NOEUD){
            element.maille(composants, mailles, [...maille], i, inverse);
            return;
        }else {
            let sens = indexSeparate>i ? inverse : !inverse;
            maille.push({element, sens});
        }
    }
    mailles.push(maille);
}