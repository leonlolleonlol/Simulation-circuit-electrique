let undo_button;
let redo_button;
let reset_button;
let logout_button;
let animation_button;
let projet_name;

let undo_tip;
let redo_tip;
let reset_tip;
let animation_tip;

function initDom() {
  // référence temporaire 
  let line_grid_button = select('#line-grid');
  let point_grid_button = select('#point-grid');
  let point_line_grid_button = select('#point-line-grid');
  let telecharger_button = select('#download');
  let upload_button = select('#upload');
  let sauvegarder_button = select('#save');
  let projet_name = select('#projet-input');

  //Les boutons mise-à-jour
  undo_button = select('#undo');
  redo_button = select('#redo')
  reset_button = select('#reset');
  logout_button = select('#logout')??select('#login');
  animation_button= select('#animate');
  undo_tip = select('#undo-tip');
  redo_tip = select('#redo-tip');
  reset_tip = select('#reset-tip');
  animation_tip = select('#animation-tip');
  let animate_image = select('#animate_image');

  //fonction lors d'appel boutton
  reset_button.mousePressed(refresh);
  undo_button.mousePressed(undo);
  redo_button.mousePressed(redo);
  line_grid_button.mousePressed(()=>{ grid.quadrillage=QUADRILLE;});
  point_grid_button.mousePressed(()=>{ grid.quadrillage=POINT;});
  point_line_grid_button.mousePressed(()=>{ grid.quadrillage=QUADRILLEPOINT;});
  telecharger_button.mousePressed(telecharger);
  upload_button.mousePressed(upload);
  sauvegarder_button.mousePressed(sauvegarder);


  projet_name.elt.addEventListener('keyup',function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      name = projet_name.value();
      projet_name.elt.blur()
    }
  });
  projet_name.changed(()=>{name = projet_name.value();})

  animation_button.mousePressed(() => {
    animate=!animate;
    if(animate){
      animate_image.attribute('src','images/icons/square.svg');
      animation_tip.html('Arrêter l\'animation');
    }else{
      animate_image.attribute('src','images/icons/play.svg');
      animation_tip.html('Jouer l\'animation');
    }
  });

  //association tooltip
  setTooltip(line_grid_button,'#line-grid-tip');
  setTooltip(point_grid_button,'#point-grid-tip');
  setTooltip(point_line_grid_button,'#pointLine-grid-tip');
  setTooltip(select('#acceuil'),'#acceuil-tip');
  setTooltip(telecharger_button,'#download-tip');
  setTooltip(upload_button,'#upload-tip');
  setTooltip(sauvegarder_button,'#save-tip');
  setTooltip(undo_button,'#undo-tip');
  setTooltip(redo_button,'#redo-tip');
  setTooltip(reset_button,'#reset-tip');
  setTooltip(animation_button,'#animation-tip');
  setTooltip(logout_button, select('#logout-tip')!=null ? '#logout-tip' : '#login-tip');

}

/**
 * Applique une animation au tooltip. Cette animation consiste à attendre 1 seconde
 * avant que le tooltip s'affiche
 * @param {p5.Button} button Le bouton associé avec le tooltip
 * @param {string} tooltipId l'identifiant du tooltip
 */
function setTooltip(button,tooltipId){
    //http://jsfiddle.net/xaliber/TxxQh/
    let tooltip = select(tooltipId);
    let tooltipTimeout;
    button.mouseOver(function(){
      tooltipTimeout = setTimeout(function(){
        if(button.attribute('disabled')==null)
          tooltip.style('visibility', 'visible');
      }, 1000);
    });
    button.mouseOut(function(){
      clearTimeout(tooltipTimeout);
      tooltip.style('visibility', 'hidden');
    });
  }
  
  /**
   * Met à jour un bouton si la vérification de l'activation
   * @param {p5.Element} button La référence du vers le bouton 
   * {@link https://p5js.org/reference/#/p5.Element | p5.Element}
   * @param {boolean} verification le résultat de la vérification à faire
   */
  function validBoutonActif(button, verification, tooltip) {
    if(verification && button.attribute('disabled')==null){
      button.attribute('disabled', '');
      tooltip.style('visibility', 'hidden');
    }
    else if(!verification && button.attribute('disabled')!=null){
      button.removeAttribute('disabled');
    }
  }
  
  /**
   * Validation de l'activation d'un bouton
   */
  function updateBouton(){
    validBoutonActif(undo_button, undo_list.length == 0, undo_tip);
    validBoutonActif(redo_button, redo_list.length == 0, redo_tip);
    validBoutonActif(reset_button, undo_list.length == 0, reset_tip);
    validBoutonActif(animation_button, components.length==0, animation_tip);
  }