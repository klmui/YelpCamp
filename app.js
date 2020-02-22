// Need to install express, body-parser, ejs, mongoose,
// passport, passport-local, passport-local-mongoose, express-session
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),

    // Models
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./views/seeds"),

    // Routes
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//console.log(process.env.DATABASEURL); // export DATABASEURL=mongodb://localhost/yelp_camp
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useCreateIndex: true}).then(() => {
    console.log('Connected to DB!');
}).catch((err) => {
    console.log('Error:', err.message);
}); // use env variable
// mongoose.connect("mongodb+srv://kenny:S220wLBLe0sqgYdb@cluster0-cbsye.mongodb.net/test?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useCreateIndex: true
// }).then(() => {
//     console.log('Connected to DB!');
// }).catch((err) => {
//     console.log('Error:', err.message);
// });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// __dirname is the directory that this was run in
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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
    // Creates a variable called currentUser for every file
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Use route files
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // Appends '/campgrounds' to each route 
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000 || process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});