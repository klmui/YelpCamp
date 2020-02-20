var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req,res){
    res.render("landing");
})

// ===========
// AUTH ROUTES
// ===========

// Show register form
router.get("/register", function(req, res){
    res.render("register");
}); 

// Handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}) // Takes the username from the form. Don't add password
    // Put things you don't want to save explicitly to db in the middle
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });  // Provided by passportLocalMongoose. 
});

// Show login form
router.get("/login", function(req, res){
    res.render("login"); // "error is the key from the flash"
});

// Handling login logic
router.post("/login", passport.authenticate("local",
 {
     successRedirect: "/campgrounds",
     failureRedirect: "login",
     failureFlash: "Sorry! You couldn't login",
     successFlash: "Login, successful"
}), function(req, res){

});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;