import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from './pages/auth/Register';
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Help from "./pages/Help";
import DebtorDetail from "./components/DebtorDetail";
import AdminRoutes from "./pages/AdminRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DynamicPage from "./pages/DynamicPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import PageList from "./components/PageList";
import PriceList from "./components/PriceList";
import PriceListDetail from "./components/PriceListDetail";


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
          <Route path="/help" element={<Help />} />
          <Route path="/pricelist" element={<PriceList />} />
          <Route path="/pricelists/:id" element={<PriceListDetail />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/debts/:id" element={<DebtorDetail />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/page/:link" element={<DynamicPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>

  );
};

export default App;
