import { axiosInstance } from "./axiosinstance";

export const createRazorpayOrder = async (showId, seats) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/razorpay/order",
      { showId, seats }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to create Razorpay order.",
    };
  }
};

export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/razorpay/verify",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to verify payment.",
    };
  }
};

export const createFinalBooking = async (bookingId, razorpayPaymentId) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/bookings",
      {
        bookingId: bookingId,
        razorpayPaymentId: razorpayPaymentId,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error finalizing booking:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
