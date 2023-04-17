const express = require('express')
const app = express()
const port = 3000;
const path = require('path')
app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/acceuil.html'));
  });
  app.get('/sketch.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/javascripts/sketch.js'));
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