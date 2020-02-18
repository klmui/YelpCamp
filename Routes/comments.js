var express = require("express");
var router  = express.Router({mergeParams: true}); // Id wasn't found so add merge params from campgrounds
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments routes

// Comments new
// Hides new comment form if the user is not logged in
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
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
                    comment.author.id = req.user._id;
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

// Edit button in form calls this route
// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // req.body.(name of the value in form)
    console.log(req.params.comment_id);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
 });

 // Comment destroy route
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
 });

module.exports = router;