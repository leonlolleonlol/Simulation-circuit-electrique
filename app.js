const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const express = require('express');
const flash = require("express-flash");
const rateLimit  = require('express-rate-limit');
const session = require("express-session");
const passport=require("passport");
const path = require('path');

const initializePassport=require("./passportConfig");
const { pool } = require("./dbConfig");

const app = express();

var limiter = rateLimit ({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

});
initializePassport(passport);

// apply rate limiter to all requests
app.use(limiter);


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/javascripts')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");

app.listen(3000, () => {
  var url = `http://localhost:3000`
  console.log('Server listen on '+url);
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32' ? 'start' : 'xdg-open');
  require('child_process').exec(start + ' ' + url+'/acceuil');
});

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
      'UPDATE users SET details=array_append(details, $1) WHERE email = $2',
      [string,req.user.email]
    );
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

