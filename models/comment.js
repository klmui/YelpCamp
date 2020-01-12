var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // Model
        },
        username: String
    }
});

// This will be "comments" in mongoDB
module.exports = mongoose.model("Comment", commentSchema);