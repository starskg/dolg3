// src/components/PublicRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    // Agar foydalanuvchi tizimga kirgan bo'lsa, login sahifasiga kirishni oldini olamiz va /dashboard ga yo'naltiramiz
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
