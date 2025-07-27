import { axiosInstance } from './axiosinstance';

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('http://localhost:5000/profile'); 
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch profile." };
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put('http://localhost:5000/profile', profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || "Failed to update profile." };
    }
};