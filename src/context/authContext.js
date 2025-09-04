import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { setToken, clearToken } from "../services/tokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role }

  useEffect(() => {
    // Try to rehydrate using the refresh cookie
    const refresh = async () => {
      try {
        const res = await api.post("/token/refresh-token", {}, { withCredentials: true });
        const { jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
        setUser(userData);
      } catch (err) {
        clearToken();
        setUser(null);
      }
    };
    refresh();
  }, []);

  const login = (userData) => {
    // userData expected to contain jwtToken and user info
    const { jwtToken, user: userInfo } = userData;
    setToken(jwtToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    setUser(userInfo || userData);
  };

  const logout = async () => {
    try {
      await api.post("/token/revoke", {}, { withCredentials: true }); // clear server cookie & revoke
    } catch (err) {}
    clearToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

