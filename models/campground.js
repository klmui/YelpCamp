var mongoose = require("mongoose");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: {type: String, default: "Middle of Nowhere"},
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // Needs square brackets if it will hold multiple things
    comments: [
        {
            // This is how we associate a comment with a campground
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

// Will turn into campgrounds in DB
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;