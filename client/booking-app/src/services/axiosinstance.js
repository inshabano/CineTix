import axios from "axios";
import { message } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.inshabano.live';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            message.error("Your session has expired or is invalid. Please log in again.");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);