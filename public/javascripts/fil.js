class Fil{
  
  constructor(xi, yi, xf, yf){
    this.xi = xi;
    this.yi = yi;
    this.xf = xf;
    this.yf = yf;
    this.courant = 0;
    
  }

  draw(offX, offY){
    push();
    translate(offX, offY);
    if(isElementSelectionner(this) && !isElementSelectionner(drag)){
      push();
      strokeWeight(30);
      stroke('rgba(255, 165, 0, 0.2)');
      let mul = this.yi >this.yf? -1 : 1;
      let decalageX = 9 * Math.sin(this.angle()) * mul;
      let decalageY = 9 * Math.cos(this.angle()) * mul;
      line(this.xi + decalageX, this.yi + decalageY, 
           this.xf - decalageX, this.yf - decalageY);
      pop();
    }
    stroke('orange');
    fill('red')
    strokeWeight(4);
    line(this.xi, this.yi, this.xf, this.yf);
    if(animate){
      let nbCharge = Math.floor(this.longueur()/grid.tailleCell);
      let decalageCharge = (percent*(1+Math.floor(this.courant))/nbCharge) % 1
      for(let i = 0;i < nbCharge;i++){
        let percentCharge = (decalageCharge + i/nbCharge)% 1;
        let pos = posAtPercent(this, percentCharge);
        circle(pos.x,pos.y,10);
      }
    }
    pop();
  }

  inBounds(x, y){
    if(!this.inBoxBounds(x,y)){
      return false;
    }
    let fx = this.getFunction();
    let xTest = y * 1/fx.pente + fx.ordonneY;
    let yTest = x * fx.pente + fx.ordonneX;
    return dist(xTest, y, x, y) < 15 || dist(x, yTest, x, y) < 15;
  }

  inBoxBounds(x, y){
    let x1 = Math.min(this.xi-10, this.xf-10);
    let x2 = Math.max(this.xi+10, this.xf+ 10);
    let y1 = Math.min(this.yi-10, this.yf-10);
    let y2 = Math.max(this.yi+10, this.yf+10);
    return x > x1 && x < x2 && y > y1 && y < y2;
  }

  pente(){
    return (this.yf-this.yi)/(this.xf-this.xi);
  }
  
  getFunction(){
    let penteFil = this.pente();
    return {pente:penteFil, ordonneX: this.yi - this.xi * penteFil, 
      ordonneY: this.xi - this.yi * 1/penteFil};
  }

  angle(){
    return Math.atan(1/this.pente());
  }
  longueur(){
    return dist(this.xi, this.yi, this.xf, this.yf);
  }

  overlap(fil2){
    let f1 = this.getFunction();
    let f2 = fil2.getFunction();
    if(Math.abs(f1.pente) === Math.abs(f2.pente) &&
      Math.abs(f1.ordonneX) === Math.abs(f2.ordonneX)){
      if((f1.pente == 0 && this.yi===fil2.yi)|| Math.abs(f1.pente) != Infinity){
        return (fil2.xi >= this.xi && fil2.xi <= this.xf) || (this.xi >= fil2.xi && this.xi <=fil2.xf);
      }else if (Math.abs(f1.pente) == Infinity && this.xi===fil2.xi){
        return (fil2.yi >= this.yi && fil2.xi <= this.yf) || (this.yi >=fil2.yi && this.yi <= fil2.yf);
      }
    }
    else return false;
  }

  trierPoint(){
    let sortArray = [{x:this.xi, y:this.yi}, {x:this.xf, y:this.yf}];
    if(Math.abs(this.pente())==Infinity){
      sortArray.sort((a, b) => a.y - b.y);
    }else sortArray.sort((a, b) => a.x - b.x);
    this.xi = sortArray[0].x;
    this.yi = sortArray[0].y;
    this.xf = sortArray[1].x;
    this.yf = sortArray[1].y;
  }

  getType(){
    return FIL;
  }
}
