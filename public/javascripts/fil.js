class Fil{
  
  constructor(x,y){
    composant = getConnectingComposant(x,y)
    fil = filStart(x, y)
    if(composant!=null){
      this.begin = composant;
      //this.borne = composant.getConnectionSens();
    }
    else this.begin = fil;
    this.borne = borne;//droite ou gauche
    
    this.end = {x:begin.x, y:begin.y};
    
  }

  disconnect(){
    circuit.disconnect(this.begin,this.end);
  }

  connect(){
    circuit.connect(this.begin,this.end);
  }

  updateConnection(composantSupprimer){
    if(this.begin === composantSupprimer){
      this.begin = {x:begin.x, y:begin.y};
      this.disconnect(this.begin,this.end)
    }else if (this.end === composantSupprimer){
      this.end = {x:end.x, y:end.y};
      circuit.disconnect(this.begin,this.end)
    }
  }

  updateEnd(x,y){
    this.end.x = x;
    this.end.y = y;
  }
  inBounds(x, y){
    if(!inBoxBoundFil(this,x,y)){
      return false;
    }
    let penteF = this.pente();
    let b = this.yi - this.xi * penteF;
    let xTest = (y - b)/penteF;
    let yTest = x * penteF + b;
    return dist(xTest, y, x, y) < 15 || dist(x, yTest, x, y) < 15
  }
  pente(){
    return (this.yf-this.yi)/(this.xf-this.xi);
  }
  angle(){
    return Math.atan(1/this.pente());
  }
  length(){
    return dist(fil.xi, fil.yi, fil.xf, fil.yf);
  }

  overlap(fil2){
    let pente1 = this.pente();
    let pente2 = fil2.pente();
    let b1 = this.yi - this.xi * pente1;
    let b2 = fil2.yi - fil2.xi * pente2;
    pente1 = Math.abs(pente1);
    pente2 = Math.abs(pente2);
    if(pente1 === pente2 && Math.abs(b1) === Math.abs(b2)){
      if((pente1 == 0 && this.yi===fil2.yi)|| pente1 != 0){
        let x1i = Math.min(this.xi,this.xf);
        let x1f = Math.max(this.xi,this.xf);
        let x2i = Math.min(fil2.xi,fil2.xf);
        let x2f = Math.max(fil2.xi,fil2.xf);
        return ((x2i >=x1i && x2i <= x1f) || (x1i >= x2i && x1i <=x2f))
      }else if (pente1 == Infinity && this.xi===fil2.xi){
        let y1i = Math.min(this.yi,this.yf);
        let y1f = Math.max(this.yi,this.yf);
        let y2i = Math.min(fil2.yi,fil2.yf);
        let y2f = Math.max(fil2.yi,fil2.yf);
        return ((y2i <= y1f && y2i >=y1i) || (y1i <=y2f && y1i >= y2i))
      }
    }
    else return false;
  }

  get xi(){
    if(this.begin instanceof Composant){
      return (this.begin.getConnection(this.borneA)??this.begin).x;
    }
    else if(this.begin instanceof Fil){
      return this.begin.xf;
    }
  }
  get yi(){
    if(this.begin instanceof Composant){
      return (this.begin.getConnection(this.borneA)??this.begin).y;
    }
    else if(this.begin instanceof Fil){
      return this.begin.yf;
    }else return this.begin.y;
  }
  get xf(){
    if(this.end instanceof Composant){
      return (this.end.getConnection(this.borneB)??this.end).x;
    }
    else if(this.end instanceof Fil){
      return this.end.xi;
    }
  }
  get yf(){
    if(this.end instanceof Composant){
      return (this.end.getConnection(this.borneB)??this.end).y;
    }
    else if(this.end instanceof Fil){
      return this.end.yi;
    }else return this.end.y;
  }
}
