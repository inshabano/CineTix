
const mongoose = require('mongoose'); 
const { userModel } = require('../models/user.model'); 
const movieModel = require('../models/movie.model'); 


const addMovieToWatchlist = async (req, res) => {
    try {
        const userId = req.userDetails?._id; 
        const { movieId } = req.body; 

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }
        if (!movieId) {
            return res.status(400).json({ success: false, message: "Movie ID is required." });
        }

        
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ success: false, message: "Invalid Movie ID format." });
        }

        
        const movie = await movieModel.findById(movieId);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found." });
        }

        
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId, watchlist: { $ne: movieId } }, 
            { $addToSet: { watchlist: movieId } }, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            
            const userExists = await userModel.exists({ _id: userId });
            if (userExists) {
                 return res.status(200).json({ success: true, message: "Movie already in watchlist." });
            } else {
                 return res.status(404).json({ success: false, message: "User not found." });
            }
        }

        return res.status(200).json({ success: true, message: "Movie added to watchlist successfully." });

    } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        res.status(500).json({ success: false, message: "Server error: Could not add movie to watchlist." });
    }
};


const removeMovieFromWatchlist = async (req, res) => {
    try {
        const userId = req.userDetails?._id;
        const { movieId } = req.params; 

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }
        if (!movieId) {
            return res.status(400).json({ success: false, message: "Movie ID is required in parameters." });
        }

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ success: false, message: "Invalid Movie ID format." });
        }

        
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { watchlist: movieId } }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({ success: true, message: "Movie removed from watchlist successfully." });

    } catch (error) {
        console.error("Error removing movie from watchlist:", error);
        res.status(500).json({ success: false, message: "Server error: Could not remove movie from watchlist." });
    }
};


const getWatchlist = async (req, res) => {
    try {
        const userId = req.userDetails?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }

        
        const user = await userModel.findById(userId)
                                    .populate('watchlist') 
                                    .select('watchlist'); 

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        
        const validWatchlist = user.watchlist.filter(movie => movie !== null);

        return res.status(200).json({ success: true, data: validWatchlist });

    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ success: false, message: "Server error: Could not retrieve watchlist." });
    }
};

module.exports = {
    addMovieToWatchlist,
    removeMovieFromWatchlist,
    getWatchlist
};