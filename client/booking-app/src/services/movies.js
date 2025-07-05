const { axiosInstance } = require("./axiosinstance");

export const getAllMovies= async ()=>{
    try{
       const response =  await axiosInstance.get("http://localhost:5000/movies");
       return response.data;

    }catch(err){
        return err.response;
    }
}

export const searchMoviesSuggestions = async (query) => {
    try {
        const response = await axiosInstance.get(`http://localhost:5000/suggestions`,{ params: { query } });
        console.log(response);
        return response.data; 
    } catch (error) {
        console.error("Error fetching movie suggestions:", error);
        return { success: false, data: [], message: error.response?.data?.message || "Failed to fetch suggestions" };
    }
};

export const searchMovies = async (query) => {
    try {
        const response = await axiosInstance.get(`http://localhost:5000/search`, { params: { query } });
        return response.data;
    } catch (error) {
        console.error("Error fetching search results:", error);
        return { success: false, data: [], message: error.response?.data?.message || "Failed to fetch search results" };
    }
};

export const getMovieData = async (movieid)=> {
    console.log(movieid)
    try{
        const response = await axiosInstance.get(`http://localhost:5000/movies/${movieid}`);
        return response.data;
    }catch(err){
        return err.response;
    }
}

export const getBooking = async (movieid)=>{
    try{
        const response = await axiosInstance.get(`http://localhost:5000/movies/${movieid}/booking`);
        return response.data;
    }catch(err){
        return err.response;
    }
}

// src/services/movies.js
// ... (your existing imports and functions)

// Function to get available dates for a movie
export const getAvailableDates = async (movieId) => {
    try {
        const response = await axiosInstance.get(`/movies/${movieId}/available-dates`);
        return response.data;
    } catch (err) {
        console.error(`Error fetching available dates for movie ${movieId}:`, err);
        return { success: false, data: [], message: err.response?.data?.message || "Failed to fetch available dates." };
    }
};

// Function to get theaters and showtimes for a movie on a specific date
export const getTheatersAndShowtimes = async (movieId, date) => {
    try {
        // Example API path: /movies/60c72b2f9f1b2c001c8e4d3f/theaters?date=2024-07-03
        const response = await axiosInstance.get(`/movies/${movieId}/theaters`, {
            params: { date }
        });
        return response.data;
    } catch (err) {
        console.error(`Error fetching theaters for movie ${movieId} on ${date}:`, err);
        return { success: false, data: [], message: err.response?.data?.message || "Failed to fetch theaters and showtimes." };
    }
};