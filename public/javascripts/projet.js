
const components = [];// Liste de composants du circuit
const fils = [];// Liste des fils du circuit
let name;
let id;


function initProjet(){
  let projet = select('#circuit');
  if(projet!=null){
    load(JSON.parse(projet.elt.innerText));
  }else{
    loadLocalCircuit();
    id = Date.now();
  }
}

/**
 * Cette fonction permet de load un circuit à partir de donnée Json. Cette fonction est très
 * importante puisque certaine donné doivent être résolue (transformé en bon format) comme 
 * le type de l'objet (prototype) qui est très important pour les méthodes et 
 * les id (voir commentaire dans fonction sauvegarder)
 * @param {object} data Un objet représentant nos données
 */
function load(data) {
  id = data.id ?? Date.now();
  name = data.name ?? ('Circuit inconnus ' + id);
  let tempElements = data.components.concat(data.fils);
  components.length = fils.length = 0;
  let map = new Map();

  // Réaffecter les méthodes de classe
  tempElements.map((element) => {
    let objetVide = element.type == FIL ? new Fil() : new Composant(element.type);
    let object = Object.assign(objetVide, element);//ajouter information à l'objet vide
    if (object instanceof Composant) {
      components.push(object);
    }
    else if (object instanceof Fil) {
      fils.push(object)
    }
    map.set(object.id, object);
    return object;
  })

  // Remplacer les id par des objets
  for (const element of tempElements) {
    for (const key in element) {
      if (Object.hasOwnProperty.call(element, key)) {
        const value = element[key];
        if (typeof value == 'object' && value != null && value.id != null) {
          element[key] = map.get(value.id);
        }
      }
    }
  }
}

/**
 * Transforme notre circuit en string json. Aussi, remplace les occurences 
 * d'objet répétitive par leurs identifiants
 * @returns {string}
 */
function getStringData() {
  let informations = { id, name, components, fils };
  let caches = [];// permet d'enregistrer un objet une fois et d'utiliser des numéros d'identification les autres fois
  return JSON.stringify(informations, function (key, value) {
    if (value instanceof Composant || value instanceof Fil) {
      if (!caches.includes(value)) {
        caches.push(value);
        return value;
      } else return { id: value.id }
    }
    return value;
  });
}


/**
 * Fonction qui permet d'envoyer une requête au serveur pour enregistrer le circuit.
 * La fonction va automatiquement produire une alerte si une erreur dans quelconque est produite
 */
async function sauvegarder() {
  let data = getStringData();
  // envoi de la requête
  await fetch('/query', {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: data,
  }).then(function (response) {
    //les actions à faire lorsque notre action réussis
    console.log('JSON data saved successfully');
  }).catch(function () {
    alert('Votre sauvegarde a échouer');
  });
}

/**
 * Fait une requête au serveur pour récupérer un des circuits test qui est 
 * enregistrer dans sur le serveur (pas dans la base de donné) et load le circuit
 * @param {string} Le nom du fichier json contenant le circuit demander. Par défaut le circuit de base
 * @see baseCircuit Le nom du circuit à récupérer
 */
async function loadLocalCircuit(circuit = baseCircuit) {
  fetch('test/circuit/' + circuit)
    .then((response) => response.json())
    .then((json) => load(json));
}

/**
 * @see https://www.aspsnippets.com/Articles/Download-JSON-object-Array-as-File-from-Browser-using-JavaScript.aspx
 */
function telecharger() {
  let data = [getStringData()];
  const blob = new Blob(data, { type: "application/json" });
  let isIE = false || !!document.documentMode;
  if (isIE) {
    window.navigator.msSaveBlob(blob, "circuit.json");
  } else {
    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(blob);
    let a = document.createElement("a");
    if (name != 'Circuit inconnus')
      a.download = name + ".json";
    else a.download = "circuit.json";
    a.href = link;
    a.click();
  }
}

/**
 * 
 */
function upload() {
  let input = document.createElement("input");
  input.type = "file";
  input.addEventListener("change", function () {
    if (this.files[0] != null) {
      let file = this.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        load(JSON.parse(reader.result));
      };
      reader.readAsText(file);
    }
  }, false);
  input.click();
}