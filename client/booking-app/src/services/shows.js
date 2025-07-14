const { axiosInstance } = require("./axiosinstance"); 
export const getShowData = async (movieId, date) => {
    try {
        const response = await axiosInstance.get(`/shows/movies/${movieId}?date=${date}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching show data:', error);

        return { success: false, data: [], message: error.response?.data?.message || "Failed to fetch show data." };
    }
};

export const getTheatresAndShowtimes = async (movieId, date) => {
    try {
        const response = await axiosInstance.get(`http://localhost:5000/shows/movies/${movieId}?date=${date}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching theatres and showtimes:', error);
        return { success: false, data: [], message: error.response?.data?.message || "Failed to fetch theatres and showtimes." };
    }
};
