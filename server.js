const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Handlebars = require("handlebars");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");

// init app
const app = express();

// import students routes
const student = require("./Routes/students");
//import auth routes
const auth = require("./Routes/auth")

// handlebars helper middlewares
Handlebars.registerHelper("trimString", function (passedString) {
  var theString = [...passedString].splice(6).join("");
  return new Handlebars.SafeString(theString);
});

//connect database;
mongoose.connect(
  process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) throw err;
    console.log("database is connected");
  }
);
//express handlebars middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//serve static file and express.static middleware
app.use(express.static(__dirname + "/node_modules"));
app.use(express.static(__dirname + "/public"));

//bodyparser middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
//load passport modules
require('./config/passport')(passport)

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// set global variables to acess anywhere in your app
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.errors_msg = req.flash("errors_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//methgod override middleware
app.use(methodOverride('_method'))

//home routes can add in server.js file only
app.get("/", (req, res) => {
  res.render("home.handlebars");
});

//use application level middleware app.use
app.use("/student", student);
app.use("/auth", auth);

// page not found route
app.get("**", (req, res) => {
  res.render("pagenotfound.handlebars");
});

let port = process.env.PORT || 6335;

app.listen(port, (err) => {
  if (err) throw err;
  console.log("app is running on port number " + port);
});