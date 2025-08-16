const movieModel = require("../models/movie.model");
const mongoose = require("mongoose");
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION 
});
const s3 = new AWS.S3();

const getAllMovies = async (req, res) => {
  try {
    const allMovies = await movieModel.find({});
    return res.status(200).send({
      success: true,
      message: "All movies have been fetched",
      data: allMovies,
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
      error: err.message,
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Movie id format is invalid",
      });
    }
    const movie = await movieModel.findById(req.params.id);
    if (!movie) {
      return res.status(400).send({
        success: false,
        message: "Movie with this id does not exists",
      });
    }
    return res.status(200).send({
      success: true,
      message: "movie details have been fetched",
      data: movie,
    });
  } catch (err) {
    console.error("Error in getting the movie:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
      error: err.message,
    });
  }
};

const addMovie = async (req, res) => {
    try {
        const { posterData, ...movieDetails } = req.body;
      
        const key = `posters/${Date.now()}_${movieDetails.movieName.replace(/\s/g, '_')}.jpg`;
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(posterData.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
            ContentType: 'image/jpeg',
            ACL: 'public-read' 
        };

        const uploadResult = await s3.upload(params).promise();
        const posterUrl = uploadResult.Location; 
        const newMovie = new movieModel({ ...movieDetails, poster: posterUrl });
        const savedMovie = await newMovie.save();

        return res.status(201).json({
            success: true,
            message: "New movie added successfully",
            data: savedMovie,
        });
    } catch (err) {
        console.error("Error adding movie:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error: err.message,
        });
    }
};

const deleteMovieByID = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Movie id format is invalid",
      });
    }
    const movie = await movieModel.findById(req.params.id);
    if (!movie) {
      return res.status(400).send({
        success: false,
        message: "Movie with this id does not exists",
      });
    }
    const deleteRespopnse = await movieModel.findByIdAndDelete(movie);
    if (deleteRespopnse != 0) {
      return res.status(200).send({
        success: true,
        message: "Movie was deleted successfully",
      });
    }
  } catch (err) {
    console.error("Error in getting the movie:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
      error: err.message,
    });
  }
};

const updateMovieByID = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Movie id format is invalid",
      });
    }
    const movie = await movieModel.findById(req.params.id);
    if (!movie) {
      return res.status(400).send({
        success: false,
        message: "Movie with this id does not exists",
      });
    }
    const updateResponse = await movieModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updateResponse != null) {
      return res.status(200).send({
        success: true,
        message: "Movie details updated successfully",
        data: updateResponse,
      });
    }
  } catch (err) {
    console.error("Error in getting the movie:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again.",
      error: err.message,
    });
  }
};

const getMovieSuggestion = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.send({ success: true, data: [] });
    }
    const suggestions = await movieModel
      .find(
        { movieName: { $regex: query, $options: "i" } },
        { movieName: 1, _id: 0 }
      )
      .limit(10);

    const movieNames = suggestions.map((movie) => movie.movieName);
    res.send({ success: true, data: movieNames });
  } catch (error) {
    console.error("Error fetching movie suggestions:", error);
    res
      .status(500)
      .send({
        success: false,
        message: "Internal server error for suggestions.",
      });
  }
};
const getSearchedMovie = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      const allMovies = await movieModel.find({});
      return res.send({ success: true, data: allMovies });
    }
    const movies = await movieModel.find({
      movieName: { $regex: query, $options: "i" },
    });

    res.send({ success: true, data: movies });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res
      .status(500)
      .send({ success: false, message: "Internal server error for search." });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  deleteMovieByID,
  updateMovieByID,
  getMovieSuggestion,
  getSearchedMovie,
};
