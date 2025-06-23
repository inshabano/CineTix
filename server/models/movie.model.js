const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    movieName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    duration:{
        type: String,
        reuired: true,
    },
    language:{
        type: String,
        required: true
    },
    genre:{
        type:[String],
        required: true
    },
    releaseDate:{
        type:Date,
        required:true,
    },
    poster:{
        type:String,
        required:true,
    }
});

const movieModel = mongoose.model("movie_user",movieSchema);
module.exports = movieModel;