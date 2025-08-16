import { axiosInstance } from "./axiosinstance";

export const getPartnerTheatres = async () => {
  try {
    const response = await axiosInstance.get(
      `/theatres/my-theatres`
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: Failed to fetch partner theatres:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch your theatres.",
    };
  }
};

export const updatePartnerTheatre = async (theatreId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/theatres/${theatreId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Error: Failed to update theatre ${theatreId}:`,
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update theatre.",
    };
  }
};

export const deletePartnerTheatre = async (theatreId) => {
  try {
    const response = await axiosInstance.delete(
      `/theatres/${theatreId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Error: Failed to delete theatre ${theatreId}:`,
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete theatre.",
    };
  }
};


export const getPartnerTheatreShows = async () => {
  try {
    const response = await axiosInstance.get(
      `/shows/my-theatre-shows`
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: Failed to fetch partner theatre shows:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch your shows.",
    };
  }
};

export const createPartnerShow = async (showData) => {
  try {
    const response = await axiosInstance.post(
      `/shows`,
      showData
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: Failed to create show:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create show.",
    };
  }
};

export const updatePartnerShow = async (showId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/shows/${showId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Error: Failed to update show ${showId}:`,
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update show.",
    };
  }
};

export const deletePartnerShow = async (showId) => {
  try {
    const response = await axiosInstance.delete(
      `/shows/${showId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Error: Failed to delete show ${showId}:`,
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete show.",
    };
  }
};


export const getPartnerTheatreBookings = async () => {
  try {
    const response = await axiosInstance.get(
      `/bookings/my-theatres`
    );
    return response.data;
  } catch (error) {
    console.error(
      "API Error: Failed to fetch partner theatre bookings:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch bookings for your theatres.",
    };
  }
};


export const getAllMoviesForSelection = async () => {
  try {
    
    const response = await axiosInstance.get(`/movies`);
    return response.data;
  } catch (error) {
    console.error(
      "API Error: Failed to fetch movies for selection:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch movies.",
    };
  }
};
