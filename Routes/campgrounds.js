var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

// INDEX - show all campgrounds
router.get("/", function(req,res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

// CREATE route
// Following REST convention, use same name as get route
router.post("/", isLoggedIn, function(req, res){
    // req.body to access the campground being created
    // and access an attribute from the schema
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // Object to be pushed into array
    var newCampground = {name: name, image: image, description: desc, author: author};
    //campgrounds.push(newCampground);
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});


// NEW - show form to create a new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW
// Get a campground
router.get("/:id", function(req, res){
    // find the campground with id
    // Whatever is after colon can be accessed using params
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            // render and show it
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Campground route (show edit form)
router.get("/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// Get put req from EDIT form
router.put("/:id", function(req, res) {
    // find and update the correct campground
    // var data = {name: req.body.name, image: req.body.image} instead of this, wrap name in form with campground[]
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id); // params comes from the route
        }
    });
});

// UPDATE Campground route (where form submits)


// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;