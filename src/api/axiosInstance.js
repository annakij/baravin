import axios from "axios";

const SYSTEM_TOKEN = "";

const api = axios.create({
  baseURL: "https://localhost:7001", // din API-bas
  headers: {
    "XAppVersion": "0.1",
    "Content-Type": "application/json"
  }
});

// Interceptor för att lägga till JWT-token om den finns
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // sparas när man loggat in
    if (token) {
      config.headers["Authorization"] = `Bearer ${SYSTEM_TOKEN}`;
    }
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
