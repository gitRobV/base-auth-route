var express     = require('express');
var router      = express.Router();
var passport    = require('passport');
var User        = require('../models/user');

// Routes
router.get("/", function( req, res ) {
    res.render("index");
});

// Auth Routes
router.get("/register", function( req, res ) {
    res.render("register");
});

router.post("/register", function( req, res ) {
    var newUser = new User(
        {
            username: req.body.username
        }
    );
    User.register(newUser, req.body.password, function( err, user ) {
        if (err) {
            req.flash("error", err.name + " - " + err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")( req, res, function() {
            req.flash("success", "Username " + newUser.username + " Registered and Logged In Successfully!");
            res.redirect("/");
        });
    });
});

router.get("/login", function( req, res ) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function( req, res ) {
});

router.get("/logout", function( req, res ) {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.redirect("/");
});

module.exports = router;
