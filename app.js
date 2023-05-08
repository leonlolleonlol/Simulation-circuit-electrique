const express = require('express')
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded())
const port = 3000;
const path = require('path')
var nerdamer = require('nerdamer'); 
// Load additional modules. These are not required.  
require('nerdamer/Solve');
app.use(express.static('public'));
app.listen(port, () => {
  var url = `http://localhost:${port}`
  console.log('Server listen on '+url);
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
  require('child_process').exec(start + ' ' + url+'/editeur');
})
app.set("view engine", "ejs");
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/acceuil.html'));
  //res.render("index");
});
app.get('/users/register', function(req, res) {
  res.render('register');
});
app.use(express.json());
app.post('/users/register', function(req, res){
  
})

app.get('/users/login', function(req, res) {
  res.render("login");
});

app.get('/users/logout', function(req, res) {
  res.render("login");
});
app.get('/users/dashboard', function(req, res) {
  res.render("dashboard", {user: "Conor"});
});
app.get('/acceuil', function(req, res) {
  res.sendFile(path.join(__dirname, '/acceuil.html'));
});
app.get('/nerdamer/all.min.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'node_modules/nerdamer/all.min.js'));
});
app.get('/sketch.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/sketch.js'));
});
app.get('/Forme.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/Forme.js'));
});
app.get('/constantes.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/constantes.js'));
});
app.get('/Historique.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/Historique.js'));
});
app.get('/Circuit.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/Circuit.js'));
});
app.get('/p5.min.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/lib/p5.min.js'));
});
app.get('/fil.js', function(req, res){
  res.sendFile(path.join(__dirname, 'public/javascripts/fil.js'));
})
app.get('/Composant.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/javascripts/Composant.js'));
});
app.get('/editeur', function(req, res) {
  res.sendFile(path.join(__dirname, '/editeur.html'));
});

