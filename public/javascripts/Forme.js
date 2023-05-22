/**
 * Dessine un résisteur sur le canvas
 * @param {number} x coordoné en x du composant
 * @param {number} y coordoné en y du composant
 * @param {number} orientation rotation du composant en radians
 */
function resisteur(x, y, orientation, focus) {
  push();
  rectMode(CENTER);
  strokeWeight(2);
  appliquerTransformation(x, y, orientation);
  if (focus) {
    selectionBox(80, 45, 'rgba(255,165,108,0.2)');
  }
  createColorGradient(-25, -10, 25, 10,
    { stop: 0, color: 'rgb(241,39,17)' },
    { stop: 1, color: 'rgb(245,175,25)' });

  // Embout du résisteur
  quad(-20, -10, -30, -4, -30, 4, -20, 10);
  quad(20, -10, 30, -4, 30, 4, 20, 10);

  // Centre du résisteur
  rect(0, 0, 50, 25, 10);
  pop();
}

/**
 * Dessine une batterie sur le canvas
 * @param {number} x coordoné en x du composant
 * @param {number} y coordoné en y du composant
 * @param {number} orientation rotation du composant en radians
 */
function batterie(x, y, orientation, focus) {
  push();
  rectMode(CENTER);
  strokeWeight(2);
  appliquerTransformation(x, y, orientation);
  if (focus) {
    selectionBox(80, 40, 'rgba(0,255,0,0.2)', 'rgba(0,0,0,0.4)')
  }
  createColorGradient(-25, -10, 25, -10,
    { stop: 0, color: 'rgb(0,0,0)' },
    { stop: 0.35, color: 'rgb(0,0,0)' },
    { stop: 0.85, color: 'rgb(0,255,0)' },
    { stop: 1, color: 'rgb(0,255,0)' });

  rect(0, 0, 60, 20, 7.5);
  pop();
}

/**
 * Dessine un condensateur sur le canvas
 * @param {number} x coordoné en x du composant
 * @param {number} y coordoné en y du composant
 * @param {number} orientation rotation du composant en radians
 */
function condensateur(x, y, orientation, focus) {
  push();
  rectMode(CENTER);
  strokeWeight(2);
  appliquerTransformation(x, y, orientation);
  if (focus) {
    selectionBox(80, 50, 'rgba(54,209,220,0.2)');
  }
  createColorGradient(-25, -10, 25, -10,
    { stop: 0, color: 'rgb(54,209,220)' },
    { stop: 0.5, color: 'rgb(91,134,229)' },
    { stop: 1, color: 'rgb(54,209,220)' });

  rect(-12, 0, 15, 30, 3.75);
  rect(12, 0, 15, 30, 3.75);
  rect(-24.5, 0, 10, 7.5);
  rect(24.5, 0, 10, 7.5);
  pop();
}

/**
 * Dessine une diode sur le canvas
 * @param {number} x coordoné en x du composant
 * @param {number} y coordoné en y du composant
 * @param {number} orientation rotation du composant en radians
 */
function diode(x, y, orientation, focus) {
  push();
  rectMode(CENTER);
  strokeWeight(2);

  appliquerTransformation(x, y, orientation);
  if (focus) {
    selectionBox(50, 50, 'rgba(32,189,255,0.2)');
  }
  let gradCercle = drawingContext.createLinearGradient(-15, -10, 15, 10);
  gradCercle.addColorStop(1, "rgb(252,70,107)");
  gradCercle.addColorStop(0, "rgb(63,94,251)");
  noFill();
  drawingContext.strokeStyle = gradCercle;
  circle(0, 0, 38);

  // La flèche
  stroke("rgb(32,189,255)");
  fill(blendBG("rgba(32,189,255,0.6)"));
  rect(-4, 0, 22, 8, 10);
  translate(10, 0);
  push();
  rotate(-QUARTER_PI);
  rect(-5, 0, 18, 8, 4);
  pop();
  push();
  rotate(QUARTER_PI);
  rect(-5, 0, 18, 8, 4);
  pop();

  // Enlever certaines bordures de la flèche
  push();
  noStroke();
  rotate(-QUARTER_PI);
  rect(-5, 0, 16, 6, 4);
  pop();
  translate(-10, 0);
  noStroke();
  rect(-4, 0, 20, 6, 10);
  pop();
}

/**
 * Dessine une ampoule sur le canvas
 * @param {number} x coordoné en x du composant
 * @param {number} y coordoné en y du composant
 * @param {number} orientation rotation du composant en radians
 */
function ampoule(x, y, orientation, focus) {
  push();
  strokeWeight(2);
  rectMode(CENTER);
  appliquerTransformation(x, y, orientation);
  if (focus) {
    selectionBox(80, 45, 'rgba(255,255,0,0.2)')
  }
  let couleurs = [{ stop: 0, color: 'rgb(62, 81, 81)' }, { stop: 1, color: 'rgb(222, 203, 164)' }];
  createColorGradient(-30, -10, -13, -10, ...couleurs);
  rect(-17, 0, 6, 22, 0, 8, 8, 0);
  rect(-25, 0, 10, 7);

  createColorGradient(30, -10, 13, -10, ...couleurs);
  rect(17, 0, 6, 22, 8, 0, 0, 8);
  rect(25, 0, 10, 7);

  noStroke();
  let grad4 = drawingContext.createLinearGradient(-12.5, 0, 12.5, 5);
  grad4.addColorStop(0, "#F7971E");
  grad4.addColorStop(1, "#FFD200");
  drawingContext.fillStyle = grad4;
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = "#F7971E";
  circle(0, 0, 20);
  pop();
}

/**
 * Dessine une grille de type pointié (bullet)
 * @param {p5.Color} color La couleur de remplissage pour les point de la grille
 */
function pointGrid(color) {
  push();
  stroke(color);
  strokeWeight(6);
  let offsetX = grid.offsetX + (grid.translateX - grid.offsetX) % grid.tailleCell;
  let offsetY = grid.offsetY + (grid.translateY - grid.offsetY) % grid.tailleCell;
  for (let i = 0; i < windowWidth / grid.scale + grid.offsetX; i += grid.tailleCell) {
    for (let j = 0; j < windowHeight / grid.scale + grid.offsetY; j += grid.tailleCell) {
      point(offsetX + i, offsetY + j);
    }
  }
  pop();
}

/**
 * Dessine une grille de type quadrillé
 * @param {p5.Color} color La couleur de remplissage pour les lignes de la grille
 */
function lineGrid(color) {
  push();
  stroke(color);
  strokeWeight(2);
  let offsetX = grid.offsetX + (grid.translateX - grid.offsetX) % grid.tailleCell;
  for (let i = 0; i < windowWidth / grid.scale + grid.offsetX; i += grid.tailleCell) {
    line(offsetX + i, grid.offsetY, offsetX + i, height / grid.scale);
  }
  let offsetY = grid.offsetY + (grid.translateY - grid.offsetY) % grid.tailleCell;
  for (let j = 0; j < windowHeight / grid.scale + grid.offsetY; j += grid.tailleCell) {
    line(grid.offsetX, offsetY + j, width / grid.scale, offsetY + j);
  }
  pop();
}


/**
 * Applique une transformation général de positionement et de rotation
 * avec les attributs de p5.js
 * @param {number} x valeur décalage en x
 * @param {number} y valeur décalage en y
 * @param {number} orientation angle de rotation (en radians)
 * @see https://p5js.org/reference/#group-Transform
 */
function appliquerTransformation(x, y, orientation) {
  translate(x, y);
  rotate(orientation);
}

function getAlphaColor(c, alpha) {
  let copy = color(c);
  copy.setAlpha(alpha);
  return copy;
}

/**
 * Dessine une boîte de sélection
 * @param {string} innerColor La couleur intérieur de la boîte
 * @param {string} borderColor La couleur de bordure
 * @param {number} width La largeur de la boîte de sélection
 * @param {number} height La hauteur de la boîte de sélection
 */
function selectionBox(width, height, innerColor, borderColor) {
  push();
  fill(innerColor);
  stroke(blendBG(borderColor == null ? getAlphaColor(innerColor, 0.4) : borderColor));
  rect(0, 0, width, height, 10);
  pop();
}

/**
 * Cette fonction permet d'instaurer de créer deux gradient pour le dessin que l'on veut effectuer.
 * Le premier gradient va être la couleur originel et va servir à faire le style pour les 
 * contour de notre dessin. Le deuxième gradient va ajouter un alpha de 0.6 à la couleur
 * et va mettre définir la couleur de fill avec ce gradient.
 * @param {number} x0 Cordonné x du début du gradient
 * @param {number} y0 Cordonné y du début du gradient
 * @param {number} x1 Cordonné x de la fin du gradient
 * @param {number} y1 Cordonné y de la fin du gradient
 */
function createColorGradient(x0, y0, x1, y1, ...couleurs) {
  let fillGradient = drawingContext.createLinearGradient(x0, y0, x1, y1);
  let strokeGradient = drawingContext.createLinearGradient(x0, y0, x1, y1);
  for (const colorStop of couleurs) {
    strokeGradient.addColorStop(colorStop.stop, colorStop.color);
    fillGradient.addColorStop(colorStop.stop, blendBG(getAlphaColor(colorStop.color, 0.6)));
  }
  drawingContext.strokeStyle = strokeGradient;
  drawingContext.fillStyle = fillGradient;
}

//-------------------------------------------------------------------

/**
 * Cette fonction permet de mélanger la couleur du background avec la couleur transparente d'un composant
 * sans que la couleur résultante soit transparente. En d'autre mot, enlève le alpha de la couleur
 * @param {String} cblend 
 * @returns La couleur mélanger avec le background
 */
function blendBG(cblend) {
  colorMode(RGB, 255, 255, 255, 1);
  let c = color(backgroundColor);
  let c1 = color(cblend);
  let outputRed = red(c1) * alpha(c1) + red(c) * (1.0 - alpha(c1));
  let outputGreen = green(c1) * alpha(c1) + green(c) * (1.0 - alpha(c1));
  let outputBlue = blue(c1) * alpha(c1) + blue(c) * (1.0 - alpha(c1));
  return color(outputRed, outputGreen, outputBlue);
}
