var mongoose = require("mongoose");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: {type: String, default: "Middle of Nowhere"},
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            // This is how we associate a comment with a campground
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Will turn into campgrounds in DB
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;