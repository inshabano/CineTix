const movieModel = require("../models/movie.model");
const mongoose = require('mongoose');

const getAllMovies = async (req,res)=>{
    try{
        const allMovies = await movieModel.find({});
        return res.status(200).send({
            success: true,
            message: "All movies have been fetched",
            data: allMovies,
        })

    }catch(err){
        console.error("Error fetching movies:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error: err.message
        });
    }
    
}

const getMovieById = async (req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                success: false,
                message:"Movie id format is invalid"
            })
        }
        const movie = await movieModel.findById(req.params.id);
        if(!movie){
            return res.status(400).send({
            success: false,
            message: "Movie with this id does not exists",
        })
        }
        return res.status(200).send({
            success: true,
            message: "movie details have been fetched",
            data: movie,
        })
    }catch(err){
        console.error("Error in getting the movie:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error: err.message
        });
    }
}

const addMovie = async (req, res) => {
    try {
        const newMovie = new movieModel(req.body);
        const savedMovie = await newMovie.save();

        return res.status(201).json({
            success: true,
            message: "New movie added successfully",
            data: savedMovie
        });

    } catch (err) {
        console.error("Error adding movie:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error: err.message
        });
    }
};


const createBooking = (req,res)=> {
    return res.send({success:true, message:"New booking created successfully!!"});
}

const deleteMovieByID = async(req, res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                success: false,
                message:"Movie id format is invalid"
            })
        }
        const movie = await movieModel.findById(req.params.id);
        if(!movie){
            return res.status(400).send({
            success: false,
            message: "Movie with this id does not exists",
        })
        }
        const deleteRespopnse = await movieModel.findByIdAndDelete(movie);
        if(deleteRespopnse != 0){
            return res.status(200).send({
            success: true,
            message: "Movie was deleted successfully",

        })
        }
        
    }catch(err){
        console.error("Error in getting the movie:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error: err.message
        });
    }  
}

const updateMovieByID = async(req, res) =>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).send({
                success: false,
                message:"Movie id format is invalid"
            })
        }
        const movie = await movieModel.findById(req.params.id);
        if(!movie){
            return res.status(400).send({
            success: false,
            message: "Movie with this id does not exists",
        })
        }
       const updateResponse = await movieModel.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if(updateResponse != null){
            return res.status(200).send({
            success: true,
            message: "Movie details updated successfully",
            data: updateResponse
        })
        }
        
    }catch(err){
        console.error("Error in getting the movie:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again.",
            error: err.message
        });
    }  
}

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    createBooking,
    deleteMovieByID,
    updateMovieByID
}