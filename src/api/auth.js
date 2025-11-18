import api from "./axiosInstance";

export const authenticate = async (email, password) => {
  const response = await api.post(
    "/token/authenticate",
    { email, password },
    { withCredentials: true } // ensure server sets HttpOnly refresh cookie
  );

  return response.data; // should include short-lived jwtToken and user info
};