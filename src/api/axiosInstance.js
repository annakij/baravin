import axios from "axios";
import Cookies from "js-cookie";

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
  const token = Cookies.get("jwtToken"); // Fetch JWT token from cookie
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
        const refreshToken = Cookies.get("refreshToken");
        const res = await api.post(
          "/token/refresh-token",
          { refreshToken },
          { withCredentials: true, headers: { "XAppVersion": "0.1" } }
        );

        const newToken = res.data.jwtToken;
        Cookies.set("jwtToken", newToken, {expires:1, sameSite: 'Strict', secure: true}); // Update cookie with new token

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (err) {
        Cookies.remove("jwtToken");
        window.location.href = "/privat";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

