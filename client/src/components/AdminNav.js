import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/AdminNav.css'; // Агар стиль файллари бўлса

const AdminNav = () => {
    return (
      <nav className="admin-nav">
        <NavLink to="/admin" end activeClassName="active">Dashboard</NavLink>
        <NavLink to="/admin/pages" activeClassName="active">Саҳифалар</NavLink>
        <NavLink to="/admin/pages/create" activeClassName="active">Создать страницу</NavLink>
        <NavLink to="/admin/faq" activeClassName="active">FAQ</NavLink>
        <NavLink to="/admin/users" activeClassName="active">Фойдаланувчилар</NavLink>
        <NavLink to="/admin/settings" activeClassName="active">Созламалар</NavLink>
      </nav>
    );
  };
  
  export default AdminNav;