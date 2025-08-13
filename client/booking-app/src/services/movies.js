const { axiosInstance } = require("./axiosinstance");

const API_BASE_URL = axiosInstance.defaults.baseURL;
export const getAllMovies = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/movies`);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const searchMoviesSuggestions = async (query) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/suggestions`,
      { params: { query } }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie suggestions:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch suggestions",
    };
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || "Failed to fetch search results",
    };
  }
};

export const getMovieData = async (movieid) => {
  console.log(movieid);
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/movies/${movieid}`
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};
