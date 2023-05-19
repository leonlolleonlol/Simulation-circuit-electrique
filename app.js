const express = require('express');
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
require('nerdamer'); 
// Load additional modules. These are not required.  
require('nerdamer/Solve');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/javascripts')));
app.listen(port, () => {
  var url = `http://localhost:${port}`
  console.log('Server listen on '+url);
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32' ? 'start' : 'xdg-open');
  require('child_process').exec(start + ' ' + url+'/acceuil');
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
});
app.get('/users/register', checkAuthenticated, function(req, res) {
  res.render('register');
});
app.post('/users/register', async(req, res)=>{
  let { name, prenom,  email, password, password2,colorPicker } = req.body;
  let errors = [];
  if (!name || !prenom || !email || !password || !password2|| !colorPicker) {
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
          return res.status(404).render("register", { errors, name, prenom , email, password, password2, colorPicker });
        }
        else{
          pool.query(
            `INSERT INTO users (name, prenom, email, password, color)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, password`,
            [name, prenom, email, hashedPassword, colorPicker],
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

app.post('/query', async(req, res) => {
  let string=JSON.stringify(req.body).replace(/([a-zA-Z0-9_]+?):/g, '"$1":');
  try {
    const result = await pool.query(
      `SELECT projets
       FROM users 
       WHERE email = $1`,
       [req.body.user.email] 
    );
    let projets = result.rows[0];
    let index = projets.indexOf(element => element.id = req.body.id)
    if(index!=-1){
      await pool.query(
        `UPDATE users
         SET projets[$3]= $1 
         WHERE email = $2`, [req.body.projet, req.body.user.email, index] 
      );
    }else{
      await pool.query(
        `UPDATE users
         SET projets=array_append(projets, $1) 
         WHERE email = $2`, [req.body.projet, req.body.user.email] 
      );
    }
    const result = await pool.query(
      'UPDATE users SET details = $1 WHERE email = $2',
      [string,req.user.email]
    );
    res.sendStatus(200); // Send a success response to the client
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack trace:', err.stack);
    res.sendStatus(500);
  }
});

app.get("/users/logout", async (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("success_msg", "You have logged out");
    res.redirect("/");
  });
});
app.get('/users/dashboard', checkNotAuthenticated, async(req, res)=> {
  let obtainedRow=0;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE details is null AND email = $1',
      [req.user.email]
    );
    if(result.rows.length>0)
      obtainedRow=1;
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack trace:', err.stack);
    res.sendStatus(500);
  }
  res.render("dashboard", {user:{
    id:req.user.name,//bientôt req.user.id
    name:req.user.name,
    prenom:req.user.prenom,
    details: obtainedRow,
    color: req.user.colorPicker
    //projets:req.user.projets,
  } });
});

app.get('/test/circuit/:fileName', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/data/'+req.params.fileName+'.json'));
});
app.get('/acceuil', function(req, res) {
  res.redirect('/');
});
app.get('/nerdamer/all.min.js', function(req, res) {
  res.sendFile(path.join(__dirname, 'node_modules/nerdamer/all.min.js'));
});
app.get('/editeur', checkAuthenticatedForEditor,function(req, res) {
});
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}
function checkAuthenticatedForEditor(req, res) {
  if (req.isAuthenticated())
    return res.render("editeur", {user:{
      name:req.user.name,
      prenom:req.user.prenom,
    } });
  else
    return res.redirect(path.join(__dirname, '/'));
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

