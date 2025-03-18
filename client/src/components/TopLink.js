import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../styles/TopLink.css";

const TopLinks = () => {
  return (
    <Container className="top-links-container my-3">
      <div className="top-links d-flex justify-content-around flex-wrap">
        <Link to="/pricelist" className="top-link text-primary">Создать прайс-лист</Link>
        <Link to="/about" className="top-link">функция2</Link>
        <Link to="/profile" className="top-link">функция3</Link>
       {/*  <Link to="/settings" className="top-link">функция4</Link>
        <Link to="/help" className="top-link">функция5</Link> */}
      </div>
    </Container>
  );
};

export default TopLinks;