import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role }
  
  useEffect(() => {
    const refresh = async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) return; // Return if no refresh token
  
      // If token - fetch user profile
      try {
        const res = await api.get(
          "/customer/profile"
        );
        setUser(res.data);
  
      } catch (err) {
        setUser(null);
        Cookies.remove("jwtToken");
        Cookies.remove("refreshToken");
      }
    };
    refresh();
  }, []);

  const login = (userData) => {
    // userData expected to contain jwtToken and user info
    const { jwtToken, user: userInfo, refreshToken } = userData;

    Cookies.set("jwtToken", userData.jwtToken, {expires:1, sameSite: 'Strict', secure: true});
    Cookies.set("refreshToken", userData.refreshToken, {expires:7, sameSite: 'Strict', secure: true});
    Cookies.set("role", userData.role, {expires:1, sameSite: 'Strict', secure: true});

    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    setUser(userInfo || userData);
  };

  const logout = async () => {
    Cookies.remove("jwtToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    setUser(null);
    window.location.href = "/privat";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

