import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import DebtorDetail from "./components/DebtorDetail";
import AdminRoutes from "./pages/AdminRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DynamicPage from "./pages/DynamicPage";

const App = () => {
  return (
      <Router>
        <AuthProvider>
        <Header />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/debts/:id" element={<DebtorDetail />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/page/:link" element={<DynamicPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer/>
        </AuthProvider>
      </Router>
    
  );
};

export default App;
