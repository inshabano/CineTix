import { axiosInstance } from "./axiosinstance";

export const getBookingDetailsById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(
      `hhttps://cinetixbackend.onrender.com/bookings/${bookingId}`
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
      `https://cinetixbackend.onrender.com/mybookings`,
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
