/**
 * Cette class contient les méthodes et la liste de composante pour faire les calculs.
 */
 class Circuit{
    /**
     * Initialise toute ce qu'on aura besoin pour les calculs. Si c'est une branche, la variable circuit devient un "children" 
     * de du noeud où qui le contiendra.
     */
    constructor(){
        this.contientPile; 
        this.circuit = []; //Array de composantes qui sont en série dans cet instance(ceux en parallèle sont dans Noeud())
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

    /**
     * Ajoute une composante dans l'Array du circuit. Initialement, la méthode doit être appelé avec la pile en paramètre, sinon il n'aura
     * pas de pile dans le circuit.
     * @param {*} composant 
     */
    ajouterComposante(composant){
        this.circuit.push(composant);
    }

    /**
     * Connecte deux composantes. L'ordre est important, donc un fil qui passe de la composante1 à la composante2 n'est pas
     * pareil à un fil qui passe de la composante2 à la composante1.
     * @param {*} composanteAvant 
     * @param {*} composanteApres 
     */
    connectComposante(composanteAvant, composanteApres){
        composanteAvant.prochaineComposante.push(composanteApres);
        composanteApres.composantePrecedente.push(composanteAvant);
    }
    
    /**
     * Retire une composante à une certaine position dans l'array
     * @param {*} position 
     */
    retirerComposante(position){
        this.circuit.splice(position, 1);
    }
    
    // https://stackoverflow.com/questions/4011629/swapping-two-items-in-a-javascript-array
    /**
     * Échange la composante à l'index A avec celle de l'index B
     * @param {*} indexA Position de la composante A dans l'array circuit
     * @param {*} indexB Position de la composante B dans l'array circuit
     */  
    echangerComposantes (indexA, indexB) {
        var temp = this.circuit[indexA];
        this.circuit[indexA] = this.circuit[indexB];
        this.circuit[indexB] = temp;
    }
  
    /**
     * La méthode dirige l'ordre d'appelle des méthodes pour que les calculs se passent bien.
     * Elle doit seulement être appelé une fois sur la branche principale quand l'utilisateur pèse sur le bouton Animation.
     */
    update(){
        this.trouverPile();
        this.circuit = this.rearrangerArrayCircuit(this.circuit[0], false).circuit;
        this.trouverEq();
    }

    /**
     * Met la pile à la première position du circuit pour être prêt à réarranger l'array et prépare les calculs reliés à la pile.
     */
    trouverPile(){
        let index = this.circuit.findIndex(element => element.getType() == BATTERIE);
        if(index!=-1){
            this.contientPile = true;
            this.echangerComposantes(index, 0);
            this.tensionEQ = this.circuit[0].tension;
        }
    }

    /**
     * La méthode regarde les connections entre les composantes et les assemblent correctement pour les calculs.
     * @param {*} debutComposant 
     * C'est la composant où le réassemblage va commencer. Si c'est la première fois que la méthode est appelé, la pile doit être mise ici.
     * @param {*} insideNoeud 
     * Indique si la méthode est appelé dans un noeud. Si c'est la première fois que la méthode est appelé, ça doit être false.
     * @returns
     * Retourne une instance de la class Circuit qui contient le circuit réarrangé.
     */
    rearrangerArrayCircuit(debutComposant, insideNoeud){
        let nouvC = new Circuit();
        do{
            if(debutComposant.dejaPasser == false){
                if(debutComposant.prochaineComposante.length > 1){
                    for (const pComposant of debutComposant.prochaineComposante) {
                        debutComposant.ajouterComposante(this.rearrangerArrayCircuit(pComposant, true));
                    }
                }
                if(!(debutComposant.composantePrecedente.length > 1 && debutComposant.getType() == NOEUD)){
                    nouvC.ajouterComposante(debutComposant); 
                }
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

    /**
     * Les calculs se font ici. La méthode trouve un circuit équivalent à celui de l'utilisateur, trouve les valeurs de 
     * la tension et du courant du circuit équivalent et revient avec les bonnes valeurs au circuit de l'utilisateur. La méthode
     * assume que l'array circuit est bien construite et que les valeurs écritent par l'utilisateur sont réalistes.
     */
    trouverEq(){
        this.trouverTypeDeCircuit();
        if(this.valide){
            switch (this.type){
                case SEULEMENTR:
                    for (const element of this.circuit) {
                        if(element.getType() == RESISTEUR || element.getType() == NOEUD){
                            this.resistanceEQ += element.getType() == NOEUD?element.resistanceEQ:element.resistance;
                        }
                    }
                    if(this.contientPile){
                        this.courant = this.tensionEQ / this.resistanceEQ;
                    }
                    this.remplirResisteursAvecCourant();
                    break;
                case SEULEMENTC:
                    let capaciteTemp = 0;
                    for (const element of this.circuit) {
                        if(element.getType() == CONDENSATEUR || element.getType() == NOEUD){
                            capaciteTemp += 1 / (element.getType() == NOEUD ? element.capaciteEQ : element.capacite);
                        }
                    }
                    this.capaciteEQ = (1/capaciteTemp).round(2);
                    if(this.contientPile){
                        this.charge = this.capaciteEQ * this.tensionEQ; 
                        print(this.charge);
                    }
                    this.remplirCondensateursAvecCharge();
                    break;
                case RC:
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
     * changer la variable "type" en la réponse trouvée.
     */
    trouverTypeDeCircuit(){
        let getType = function(element, type ,secondType) {
            if(element.getType()==NOEUD){
                element.trouverEq();
                return element.type === secondType;
            }else return element.getType() === type;
        }
        let circuitR = this.circuit.some(element => getType(element, RESISTEUR, SEULEMENTR));
        let circuitC = this.circuit.some(element => getType(element, CONDENSATEUR, SEULEMENTC));
        let circuitRC = this.circuit.some(element => getType(element, NOEUD, RC));

        if((circuitR && circuitC) || circuitRC){
            this.type = RC;
        }else if (circuitC){
            this.type = SEULEMENTC;
        }else{
            this.type = SEULEMENTR;
        }
        return this.type;
    }

    /**
     * Retourne le type de l'objet Circuit
     * @returns 
     */
    getType(){
        return CIRCUIT;
    }

    /**
     * Retourne la valeur de la variable "type" du circuit.
     * @returns 
     */
    getTypeDeCircuit(){
        return this.type;
    }

    /**
     * Trouve chaque résisteur et les remplis avec le courant et le deltaV. S'il tombe sur un noeud, il continue les calculs
     * pour les résisteurs dans le noeud.
     */
    remplirResisteursAvecCourant(){
        for (const element of this.circuit){
            if(element.getType() == RESISTEUR){   
                element.courant = this.courant;
                element.tension = this.courant * element.resistance;
            }else if(element.getType() == NOEUD){
                element.tensionEQ = this.courant * element.resistanceEQ;
                element.remplirResisteursAvecDifTension();
            }
        }
    }

     /**
     * Trouve chaque condensateur et les remplis avec la charge et le deltaV. S'il tombe sur un noeud, il continue les calculs
     * pour les condensateurs dans le noeud.
     */
    remplirCondensateursAvecCharge(){
        for (const element of this.circuit) {
            if(element.getType() == CONDENSATEUR){
                element.charge = this.charge;
                element.tension = this.charge / element.capacite;
            }else if(element.getType() == NOEUD){
                element.tensionEQ = this.charge / this.capaciteEQ;
                element.remplirCondensateursAvecTension();
            }
        }  
    }
    /**
     * Retourn l'array contenant chaque composante dans l'array du circuit
     * @returns 
     */
    getCircuit(){
        return this.circuit;
    }

/****************************************************************************************************************************/
/********************************************* Autre façon de faire les calculs *********************************************/
/****************************************************************************************************************************/

    /**
     * Change le symbole de l'instance de la class
     * @param {*} symbole 
     */
    setSymbol(symbole){
        this.symbole = symbole;
        for (const enfant of this.circuit) {
            enfant.symbole = symbole;
        }
    }

    /**
     * Permet de trouver le courant de chaque circuit selon les lois
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
    /**
     * Trouve l'équivalent d'un noeud et continue à construire le string pour les calculs
     * @param {*} equations 
     */
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

    /**
     * Construit le circuit avec les différents circuits
     * @param {*} circuits 
     */
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