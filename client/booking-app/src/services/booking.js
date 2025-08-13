import { axiosInstance } from "./axiosinstance";

const API_BASE_URL = axiosInstance.defaults.baseURL;
export const getBookingDetailsById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/bookings/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booking details by ID:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch booking details.",
    };
  }
};

export const getUserBookings = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "User not logged in." };
    }

    const response = await axiosInstance.get(
      `${API_BASE_URL}/mybookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "API call error (getUserBookings):",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Error fetching bookings.",
    };
  }
};
