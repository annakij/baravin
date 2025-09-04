import axios from "axios";
import { getToken, setToken, clearToken } from "../services/tokenService";

const api = axios.create({
  baseURL: "https://localhost:7001",
  withCredentials: true,
  headers: {
    "XAppVersion": "0.1",
    "Content-Type": "application/json"
  }
});

// attach access token from memory
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// on 401 try refresh via the refresh-token endpoint (uses httpOnly cookie)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "https://localhost:7001/token/refresh-token",
          {},
          { withCredentials: true, headers: { "XAppVersion": "0.1" } }
        );
        const newToken = res.data.jwtToken;
        setToken(newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        clearToken();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

