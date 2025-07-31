const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true, 
    },
    language: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    },
    trailerLink: { 
        type: String,
        required: false 
    },
    director: { 
        name: { type: String, required: false },
        photo: { type: String, required: false } 
    },
    cast: [
        {
            name: { type: String, required: false },
            photo: { type: String, required: false }, 
            characterName: { type: String, required: false } 
        }
    ]
});

const movieModel = mongoose.model("movie_user", movieSchema);
module.exports = movieModel;