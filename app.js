const express = require('express')
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session=require("express-session");
const flash=require("express-flash");
const app = express()
const passport=require("passport");
const initializePassport=require("./passportConfig");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
initializePassport(passport);
app.use(bodyParser.json());
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
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/acceuil.html'));
  //res.render("index");
});
app.get('/users/register', checkAuthenticated, function(req, res) {
  res.render('register');
});
app.post('/users/register', async(req, res)=>{
  let { name, email, password, password2 } = req.body;
  console.log({
    name,
    email,
    password,
    password2
  });
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }
  else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log("step 1");
        if (results.rows.length > 0||errors.length > 0) {
          if(errors.length<1)
            errors.push({ message: "Email already registered!" });
          return res.status(404).render("register", { errors, name, email, password, password2 });
        }
        else{
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log("step 2");
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
      );
    }
  //res.end();
});

app.get('/users/login', checkAuthenticated, function(req, res) {
  res.render("login");
});
app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

app.get("/users/logout", async (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("success_msg", "You have logged out");
    res.redirect("/users/login");
  });
});
app.get('/users/dashboard', checkNotAuthenticated, function(req, res) {
  res.render("dashboard", {user: req.user.name});
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
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

