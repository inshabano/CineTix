import { axiosInstance } from "./axiosinstance";

export const getWatchlist = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:5000/watchlist");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching watchlist:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch watchlist.",
    };
  }
};

export const addMovieToWatchlist = async (movieId) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/watchlist/add",
      { movieId }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding movie to watchlist:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to add movie to watchlist.",
    };
  }
};

export const removeMovieFromWatchlist = async (movieId) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:5000/watchlist/remove/${movieId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error removing movie from watchlist:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to remove movie from watchlist.",
    };
  }
};
