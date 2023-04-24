const express = require('express')
const app = express()
const port = 3000;
const path = require('path')
var nerdamer = require('nerdamer'); 
// Load additional modules. These are not required.  
require('nerdamer/Algebra'); 
require('nerdamer/Calculus'); 
require('nerdamer/Solve'); 

app.use(express.static('public'))
app.listen(port, () => {
  var url = `http://localhost:${port}`
  console.log('Server listen on '+url);
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
  require('child_process').exec(start + ' ' + url+'/editeur');
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/acceuil.html'));
  });
  app.get('/nerdamer.core.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'node_modules/nerdamer/all.min.js'));
  });
  app.get('/sketch.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/sketch.js'));
  });
  app.get('/Sympy.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/Sympy.js'));
  });
  app.get('/Forme.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/Forme.js'));
  });
  app.get('/Historique.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/Historique.js'));
  });
  app.get('/Circuit.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/BackEnd/Circuit.js'));
  });
  app.get('/p5.min.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/lib/p5.min.js'));
  });
  app.get('/Composant.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/Composant.js'));
  });
app.get('/acceuil', function(req, res) {
  res.sendFile(path.join(__dirname, '/acceuil.html'));
});
app.get('/editeur', function(req, res) {
  app.use
  res.sendFile(path.join(__dirname, '/editeur.html'));
});

