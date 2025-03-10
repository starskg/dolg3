// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Agar sizning authRoutes faylingiz app.use('/auth', authRoutes) orqali o'rnatilgan bo'lsa,
        // endpoint "http://localhost:5000/auth/user" bo'ladi.
        // Agar aksincha, "http://localhost:5000/user" bo'lsa, URL ni shunga moslang.
        const response = await axios.get("http://localhost:5000/auth/user", { withCredentials: true });
       // console.log("Auth response:", response.data);
        // Agar foydalanuvchi ma'lumotlari qaytsa, isAuthenticated true bo'ladi
        setIsAuthenticated(true);
      } catch (error) {
        //console.error("Auth error:", error.response?.data || error.message);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
