import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem("ACCESS_TOKEN");
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
