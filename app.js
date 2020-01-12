// Need to install express, body-parser, ejs, mongoose,
// passport, passport-local, passport-local-mongoose, express-session
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),

    // Models
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./views/seeds"),

    // Routes
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// __dirname is the directory that this was run in
app.use(express.static(__dirname + "/public"));
// seedDB(); // Seed the db

// Passport configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate is from passportLocalMongoose 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Adds this middleware to each route. Passes user info
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// Use route files
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // Appends '/campgrounds' to each route 
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server started");
});