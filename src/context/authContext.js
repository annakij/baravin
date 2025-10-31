import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get("/customer/profile");
        setUser({
          ...res.data,
          role: Cookies.get("role") || res.data.role
        });
      } catch (err) {
        setUser(null);
        Cookies.remove("jwtToken");
        Cookies.remove("refreshToken");
        Cookies.remove("role");
      } finally {
        setIsLoading(false);
      }
    };
    refresh();
  }, []);

  const login = (userData) => {
    const { jwtToken, refreshToken, role } = userData;
    
    // Set cookies with proper expiration
    Cookies.set("jwtToken", jwtToken, {expires: 1, sameSite: 'Strict', secure: true});
    Cookies.set("refreshToken", refreshToken, {expires: 7, sameSite: 'Strict', secure: true});
    Cookies.set("role", role, {expires: 7, sameSite: 'Strict', secure: true});

    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    setUser({...userData, role});
  };

  const logout = async () => {
    Cookies.remove("jwtToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
    setUser(null);
    window.location.href = "/privat";
  };

  const isAdmin = () => {
    return user?.role === "0" || user?.role === "Admin";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

