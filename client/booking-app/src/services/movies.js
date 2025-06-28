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
        // Adjust API path to match your backend
        const response = await axiosInstance.get(`http://localhost:5000/search`, { params: { query } });
        return response.data; // Expected: { success: true, data: [movieObject1, movieObject2] }
    } catch (error) {
        console.error("Error fetching search results:", error);
        return { success: false, data: [], message: error.response?.data?.message || "Failed to fetch search results" };
    }
};