// src/pages/AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import CreatePage from './CreatePage';
import AdminRoute from '../components/AdminRoute';

const AdminRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    <Route
      path="/pages/create"
      element={
        <AdminRoute>
          <CreatePage />
        </AdminRoute>
      }
    />
    {/* Дополнительные маршруты для админ-панели можно добавить здесь */}
  </Routes>
);

export default AdminRoutes;
