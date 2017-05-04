// Required Packages
var express         = require('express'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash');

// Required Routes
var authRoutes      = require('./routes/index');

// Models
var User            = require('./models/user');

// Mongo Config
mongoose.connect("mongodb://localhost/test")

// App Config
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require('express-session')({
    secret: "Roxy V Rocks",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function( req, res, next ) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes
app.use("/", authRoutes);

app.get("/", function( req, res ) {
    res.render("index");
});

// Server Config
app.listen(3000, function() {
    console.log("We are connected");
});
