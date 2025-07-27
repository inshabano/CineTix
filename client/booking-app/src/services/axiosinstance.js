import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', 
    headers: {
        "Content-Type": "application/json",
    }
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['access-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

