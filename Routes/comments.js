var express = require("express");
var router  = express.Router({mergeParams: true}); // Id wasn't found so add merge params from campgrounds
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments routes

// Comments new
// Hides new comment form if the user is not logged in
router.get("/new", isLoggedIn, function(req, res){
    // Find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground})
        }
    });
});

// Still needs isLoggedIn to prevent POST requests to this route that can add a comment
// Comments create
router.post("/", isLoggedIn, function(req, res){
    // Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._ud;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;