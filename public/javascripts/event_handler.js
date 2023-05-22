/**
 * Cette fonction utilitaire permet de juste d'initier les principales valeurs 
 * utile lorsque l'on veut déplacer un composant (autre qu'un fil) sur la grille
 * @param {Composant} element L'élement que l'on veut drag
 * @param {number} x La position en x du composant
 * @param {number} y La position en y du composant
 */
function initDrag(element, x, y) {
    drag = element;
    selection = element;
    drag.xOffsetDrag = mouseX / grid.scale - x;
    drag.yOffsetDrag = mouseY / grid.scale - y;
}

/**
 * Créer un nouveau composant en prenant pour référence la position et le type 
 * du composant précédent sélectionner dans menu des composants
 * @param {Composant} original Le composant du menu déroulant que l'on veut copier
 * @returns Le composant qui a été copier
 */
function copyComposant(original) {
    // Création d'un nouveau composants selon le composant sélectionner
    let x = original.x / grid.scale - grid.translateX;
    let y = original.y / grid.scale - grid.translateY;
    return new Composant(original.getType(), x, y, 0);
}

/**
 * Cette fonction gére les drag des composants grahique et la vérification de sélection d'un fil
 */
function mousePressed() {
    selection = null;
    // Vérification drag panneau de choix
    let x = mouseX / grid.scale - grid.translateX;
    let y = mouseY / grid.scale - grid.translateY;
    for (const element of composants_panneau) {
        if (element.inBounds(mouseX, mouseY, 0, 0)) {
            origin = element;
            let new_element = copyComposant(element);
            initDrag(new_element, new_element.x + grid.translateX, new_element.y + grid.translateY);
            return;
        }
    }
    // Vérification drag parmis les composants de la grille
    for (let element of components) {
        if (element.inBounds(x, y)) {
            initDrag(element, element.x, element.y);
            let connections = element.getConnections();
            drag.pastAttribute = {
                x: drag.x,
                y: drag.y,
                bornes: connections,
                orientation: drag.orientation
            };
            draggedAnchor = {
                left: filStart(connections[0].x, connections[0].y, false),
                right: filStart(connections[1].x, connections[1].y, false)
            };
            return;
        }
    }

    // Vérifier possibilité de création d'un nouveau fil
    if (validFilBegin(x, y)) {
        let point = findGridLock(grid.translateX, grid.translateY);
        drag = new Fil(point.x, point.y, point.x, point.y);
        drag.origin = filStart(x, y);
        selection = drag;
        fils.push(drag);
        return;
    }

    // Vérifier sélection d'un fil
    for (const nfil of fils) {
        if (nfil.inBounds(x, y)) {
            selection = nfil;
            return;
        }
    }
    // vérification d'un déplacement de la grille
    if (inGrid(mouseX / grid.scale, mouseY / grid.scale))
        drag = grid;
}

/**
 * Met à jour les informations des éléments drag sur notre grille
 */
function mouseDragged() {
    if (drag != null) {
        if (origin != null) {
            cursor('grabbing');
            let point = findGridLock(drag.xOffsetDrag + grid.translateX,
                drag.yOffsetDrag + grid.translateY);
            drag.x = point.x;
            drag.y = point.y
        } else if (drag === grid) {
            cursor(MOVE);
            grid.translateX += (mouseX - pmouseX) / grid.scale;
            grid.translateY += (mouseY - pmouseY) / grid.scale;
        } else if (drag.getType() == FIL) {
            let point = findGridLock(grid.translateX, grid.translateY);
            drag.xf = point.x;
            drag.yf = point.y;
        } else {
            cursor('grabbing');
            let point = findGridLock(drag.xOffsetDrag, drag.yOffsetDrag);
            let pastConnect = drag.getConnections();//connection précédente
            drag.x = point.x;
            drag.y = point.y
            updateFilPos(draggedAnchor.left, draggedAnchor.right, pastConnect, drag.getConnections());
        }
    }
}

/**
 * Cette fonction offerte par p5 permet d'exécuter une action après un click avec la souris.
 * Dans le cadre du projet, c'est utiliser pour arrèter le drag si il y en a un en cours
 * et aussi de faire les modifications et vérfications finales.
 */
function mouseReleased() {
    // Arrète le drag si il y en avait un en cours
    if (drag != null) {
        cursor(ARROW);
        if (origin != null) {
            if (validComposantPos(drag)) {
                components.push(drag);
                let actions = [{ type: CREATE, objet: drag }];
                ajustementAutomatiqueComposant(drag, actions);
                addActions(actions);
            }
            origin = null;
        } else if (drag.getType() == FIL) {
            if (drag.longueur() > 0) {
                let actions = [{ type: CREATE, objet: drag }]
                ajustementAutomatiqueFil(drag, actions);
                addActions(actions);
            } else {
                let fil = fils.pop();
                if (fil.origin != null) {
                    selection = fil.origin;
                }
            }
        } else if (drag instanceof Composant) {
            if (validComposantPos(drag) && dist(drag.pastAttribute.x, drag.pastAttribute.y, drag.x, drag.y) > 0) {
                let actions = [{
                    type: MODIFIER,
                    objet: drag,
                    changements: [
                        { attribut: 'x', ancienne_valeur: drag.pastAttribute.x, nouvelle_valeur: drag.x },
                        { attribut: 'y', ancienne_valeur: drag.pastAttribute.y, nouvelle_valeur: drag.y },
                        { attribut: 'orientation', ancienne_valeur: drag.pastAttribute.orientation, nouvelle_valeur: drag.orientation }
                    ]
                }];
                setModificationFilPos(draggedAnchor.left, draggedAnchor.right,
                    drag.getConnections(), drag.pastAttribute.bornes, actions);
                ajustementAutomatiqueComposant(drag, actions);
                addActions(actions);
            } else {
                // Annuler le mouvement
                updateFilPos(draggedAnchor.left, draggedAnchor.right, drag.getConnections(), drag.pastAttribute.bornes);
                drag.x = drag.pastAttribute.x;
                drag.y = drag.pastAttribute.y;
            }
            draggedAnchor = null;
        }
        drag = null;
    }
}

/**
 * Cette fonction zoom la grille si certaines conditions sont respecter. Cette fonction est 
 * géré et appelé par p5.
 * @param {*} event l'evenement en liens avec cet appel de fonction
 * @returns false si l'on veut empécher tout comportement par défaut dans le navigateur
 * en lien avec cet évenement
 */
function mouseWheel(event) {
    if (inGrid(mouseX / grid.scale, mouseY / grid.scale)) {
        if (event.delta < 0 && grid.scale * 1.1 < 9) {
            zoom(0.1);
        }
        else if (event.delta > 0 && grid.scale * 0.9 > 0.2) {
            zoom(-0.1);
        }
        return false;
    }
}

/**
 * Modifie le zoom qui est appliquer sur notre grille et ces composants
 * @param {number} factor Le facteur de zoom. Ce facteur est soit 0.1 ou -0.1
 */
function zoom(factor) {
    let pastScale = grid.scale;
    grid.scale = grid.scale * (1 + factor);
    grid.translateX = (grid.translateX * pastScale - (mouseX - grid.translateX * pastScale) * factor) / grid.scale;
    grid.translateY = (grid.translateY * pastScale - (mouseY - grid.translateY * pastScale) * factor) / grid.scale;
    grid.offsetX *= pastScale / grid.scale;
    grid.offsetY *= pastScale / grid.scale;
}

function keyPressed() {
    /*
     * Gestion des raccourcis clavier.
     * Pour trouver les codes des combinaisons,
     * aller voir https://www.toptal.com/developers/keycode
     * 
     * Voici les raccourcis actuel:
     *  - ctrl + Z : annuler
     *  - ctrl + Shift + Z : refaire
     *  - ctrl + S : sauvegarder
     *  - backspace : supprimer sélection
     *  - T : tourner selection de 90 degré
     *  - shift + T : tourner selection de -90 degré
     *  - S : Ajouter batterie
     *  - R : Ajouter résisteur
     *  - A : Ajouter ampoule
     *  - C : Ajouter condensateur (désactiver présentement)
     *  - D : Ajouter diode (désactiver présentement)
     */
    if (keyIsDown(CONTROL)) {
        if (keyCode === 90) {
            keyIsDown(SHIFT) ? redo() : undo();
            return false;
        } else if (keyCode === 83) {
            sauvegarder();
            return false;
        }
    } else {
        if (keyCode === 8 && selection != null) {
            let index;
            if (selection.getType() !== FIL) {
                index = components.indexOf(selection)
                components.splice(index, 1);
            } else {
                index = fils.indexOf(selection)
                fils.splice(index, 1);
            }
            addActions({ type: DELETE, objet: selection, index });
            selection = null;
            return false;
        } else if (keyCode === 84 && selection != null) {
            if (selection instanceof Composant) {
                let pastConnect = selection.getConnections();
                let left = filStart(pastConnect[0].x, pastConnect[0].y, false);
                let right = filStart(pastConnect[1].x, pastConnect[1].y, false);
                let pRotate = selection.orientation;
                selection.rotate(keyIsDown(SHIFT));
                if (validComposantPos(selection)) {
                    updateFilPos(left, right, pastConnect, selection.getConnections());
                    if (drag == null) {
                        let actions = [{
                            type: MODIFIER,
                            objet: selection,
                            changements: [
                                { attribut: 'orientation', ancienne_valeur: pRotate, nouvelle_valeur: selection.orientation }
                            ]
                        }];
                        setModificationFilPos(left, right, selection.getConnections(), pastConnect, actions);
                        addActions(actions);
                    }
                } else {
                    selection.orientation = pRotate;
                }
            }
        } else if (keyCode === 82 || keyCode === 83 || keyCode === 65
          /*|| keyCode === 67 || keyCode === 68*/) {
            let point = findGridLock(grid.translateX, grid.translateY);
            let newC = function (x, y) {
                switch (keyCode) {
                    case 83: return Composant(BATTERIE, x, y, 0);//s
                    case 82: return new Composant(RESISTEUR, x, y, 0);//r
                    case 65: return new Composant(AMPOULE, x, y, 0);//a
                    case 67: return new Composant(CONDENSATEUR, x, y, 0);//c
                    case 68: return new Composant(DIODE, x, y);//d
                };
            }(point.x, point.y);
            if (validComposantPos(newC)) {
                let actions = [{ type: CREATE, objet: newC }];
                action = ajustementAutomatiqueComposant(newC, actions);
                selection = newC;
                components.push(newC);
                //circuit.ajouterComposante(newC);
                addActions(actions);
            }
        }
    }
}

/**
 * Lorsque la fenêtre du navigateur est redimensionner, il faut aussi redimensionner le canvas
 * et certaine autres positions
 */
function windowResized() {
    resizeCanvas(windowWidth - 50, windowHeight - 30);
    initPosition();
}