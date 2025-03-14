import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../styles/TopLink.css";

const TopLinks = () => {
  return (
    <Container className="top-links-container my-3">
      <div className="top-links d-flex justify-content-around flex-wrap">
        <Link to="/dashboard" className="top-link">Dashboard</Link>
        <Link to="/about" className="top-link">Информация</Link>
        <Link to="/profile" className="top-link">Профиль</Link>
        <Link to="/settings" className="top-link">Настройки</Link>
        <Link to="/help" className="top-link">Помощь</Link>
      </div>
    </Container>
  );
};

export default TopLinks;