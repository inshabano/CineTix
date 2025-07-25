import { axiosInstance } from './axiosinstance'; 

export const getBookingDetailsById = async (bookingId) => {
    try {
        const response = await axiosInstance.get(`http://localhost:5000/bookings/${bookingId}`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching booking details by ID:", error);
        return { success: false, message: error.response?.data?.message || "Failed to fetch booking details." };
    }
};