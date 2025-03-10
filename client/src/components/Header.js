// src/components/Header.js
import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  console.log("isAuthenticated:", isAuthenticated);


  // Logout funksiyasi
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("✅ Logout muvaffaqiyatli!");
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error("⚠ Noma‘lum xato logoutda:", response);
      }
    } catch (error) {
      console.error("❌ Logoutda xatolik:", error.response?.data || error.message);
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow">
      <Container>
        {/* Logotip */}
        <Navbar.Brand as={Link} to={isAuthenticated ? "/dashboard" : "/"} className="fw-bold fs-3">
          MDOLG.site
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {/* Har doim ko'rinadigan Информация */}
            <Nav.Link as={Link} to="/about" className="text-white fw-semibold">
              Информация
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-white fw-semibold">
                  Дашборд
                </Nav.Link>
                <Button variant="light" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
