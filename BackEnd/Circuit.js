let circuit = [];
let circuitEq = [];

function ajouterComposanteALaFin(composant){
    circuit.push(composant);
}

//position est l'emplacement de la valeur a modifier, le 0 est le nombre de valeur a modifier et composant est ce qu'on ajoute à la position
function ajouterComposante(composant, position){ 
    circuit.splice(position, 0, composant);
}

function retirerComposante(position){
    circuit.splice(position, 1);
}

function echangerComposantes(position1, position2){
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

function start(){ //Une fois au début

}

/**
 * Doit se faire appeler quand il y a une nouvelle connection entre 2 composantes, quand une connection est brisée et
 * quand une valeur dans une composante est modifiée.
 */
function update(){//Chaque fois qu'il y a un changement dans le circuit
    rearrangerArrayCircuit();
    if(validerCircuit()){
        trouverEq();

        //Modifer seulement le circuit Eq

        revenirCircuitDeBase();
    }
    
}

function rearrangerArrayCircuit(){
    //Mettre la pile début
}

function validerCircuit(){
    //Voir si le circuit est valide
}
function trouverEq(){
    //Cette méthode aura pour but de simplifier au max notre circuit de base.

    circuitEq[0] = circuit[0] //Mettre la pile au début dans le circuit équivalent
        if(enSerie()){
            for (let i = 1; i < circuit.length; i++){ //Commence à 1 parce qu'on sait qu'il y a la pile à 0
                let composantEq;
                if(circuit[i].getType() == circuit[i - 1]){
                    if(circuit.getType() == "résisteur"){
                        
                    } else if(circuit.getType() == "condensateur"){
                        composantEq
                    }
                } else{
                    composantEq = circuit[i];
                }

                circuitEq.push(composantEq);
            }
        }else{ //Il y a au moins un noeud dans le circuit (En parallèle)

        }
}

/**
 * Vérifie s'il y a un noeud dans le circuit. S'il y a un noeud, le circuit ne peut pas être en série.
 * @returns 
 */
function enSerie(){
    for (let i = 0; i < circuit.length; i++){
        if(circuit[i].getType == "noeud"){
            return false
        }
    }
    return true;
}
