import axios from "axios";

// Create an instance of Axios   baseURL: "http://147.93.19.18:9090",
const axiosInstance = axios.create({
  baseURL: "http://localhost:9090", // Replace with your API base URL
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
