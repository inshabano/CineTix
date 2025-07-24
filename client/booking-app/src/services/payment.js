import { axiosInstance } from './axiosinstance'; 

export const createRazorpayOrder = async (showId, seats) => {
    try {
        const response = await axiosInstance.post('/razorpay/order', {
            showId,
            seats
        });
        return response.data; 
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return { success: false, message: error.response?.data?.message || "Network error creating payment order." };
    }
};

export const verifyRazorpayPayment = async (paymentDetails) => {
    try {
        const response = await axiosInstance.post('/razorpay/verify', paymentDetails);
        return response.data; 
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        return { success: false, message: error.response?.data?.message || "Network error verifying payment." };
    }
};