/**
 * La première composante devrait toujours être la pile
 */
let circuit = [new Batterie];

function ajouterComposanteALaFin(composant){
    circuit.push(composant);
}

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
    for (let i = 0; i < circuit.length; i++){
        circuit[i].calcul;
    }
}
