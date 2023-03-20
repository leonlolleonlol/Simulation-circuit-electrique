
let circuit = [new Batterie];

function ajouterComposante(composante){
    circuit.push(composante);
}

function circuitValide(){
    var valide = true;
    circuit.forEach(verifierConnecter2cote)
    return valide;
}

function verifierConnecter2cote(composante){
    if (!composante.valide){
        valide = false;
    }
}