import { axiosInstance } from "./axiosinstance";

const API_BASE_URL = axiosInstance.defaults.baseURL;
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch profile.",
    };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/profile`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile.",
    };
  }
};
