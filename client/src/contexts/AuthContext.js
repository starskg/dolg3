import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = window.location.pathname; // useLocation() ўрнига қўллаш

  useEffect(() => {
    // Фақат /register саҳифасида эмаслигини текшириш
    if (location !== "/register") {
      axios
        .get("http://localhost:5000/auth/user", { withCredentials: true })
        .then((res) => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, [location]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
