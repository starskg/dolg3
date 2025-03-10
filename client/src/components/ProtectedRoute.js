// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    // Agar foydalanuvchi autentifikatsiya qilinmagan bo'lsa, login sahifasiga yo'naltiramiz
    return <Navigate to="/login" replace />;
  }
  
  // Aks holda, berilgan bolalarni (children) render qilamiz
  return children;
};

export default ProtectedRoute;
