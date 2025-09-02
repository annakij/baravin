import api from "./axiosInstance";

export const authenticate = async (email, password) => {
  const response = await api.post("/token/authenticate", {
    email,
    password
  });

  return response.data;
};
