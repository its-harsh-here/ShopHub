import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Configure interceptor to automatically attach token
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
  }
  return config;
});

export default API;
