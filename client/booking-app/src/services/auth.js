const { axiosInstance } = require("./axiosinstance");

export const RegisterUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/register",
      data
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const LoginUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/login",
      data
    );
    console.log(response);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const forgotPasswordRequest = async (email) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:5000/forgot-password`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error requesting password reset:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send reset link.",
    };
  }
};

export const resetPasswordWithToken = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post(
      `http://localhost:5000/reset-password/${token}`,
      { newPassword }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error resetting password:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Failed to reset password.",
    };
  }
};
