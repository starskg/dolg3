// src/components/Header.js
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCardImage,
  MDBContainer
} from 'mdb-react-ui-kit';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Достаём нужные данные из AuthContext
  const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);

  // Состояние для раскрытия/скрытия бургер-меню (MDBNavbarToggler)
  const [showNav, setShowNav] = useState(false);

  // Формируем корректный путь к аватару
  const avatarPath = user && user.avatar_url
    ? (user.avatar_url.startsWith('/') ? user.avatar_url : '/' + user.avatar_url)
    : '/uploads/default.jpg';

  // Обработчик логаута
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("✅ Logout успешен!");
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        console.error("⚠ Неизвестная ошибка при логауте:", response);
      }
    } catch (error) {
      console.error("❌ Ошибка при логауте:", error.response?.data || error.message);
    }
  };

  return (
    <Navbar bg="light" variant="primary" expand="lg" className="shadow">
      <Container>
        {/* Логотип. Если авторизован – ссылка ведёт на /dashboard, иначе – на / */}
        <Navbar.Brand
          as={Link}
          to={isAuthenticated ? "/dashboard" : "/"}
          className="fw-bold fs-3 color-primary"
        >
          MDOLG.site
        </Navbar.Brand>

        {/* Кнопка для раскрытия меню на мобильных устройствах */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {isAuthenticated ? (
              // ---------- Блок для авторизованного пользователя ----------
              <>
                {/* 1) Дашборд (первым пунктом) */}
                <Nav.Link as={Link} to="/dashboard" className="text-primary fw-semibold">
                  <i className="bi bi-speedometer2 me-2"></i>Дашборд
                </Nav.Link>

                {/* 2) Информация */}
                <Nav.Link as={Link} to="/about" className="text-primary fw-semibold">
                  <i className="bi bi-info-circle me-2"></i>Информация
                </Nav.Link>

                {/* 3) Помощь */}
                <Nav.Link as={Link} to="/help" className="text-primary fw-semibold">
                  <i className="bi bi-question-circle me-2"></i>Помощь
                </Nav.Link>

                {/* 4) Настройки */}
                <Nav.Link as={Link} to="/settings" className="text-primary fw-semibold">
                  <i className="bi bi-gear me-2"></i>Настройки
                </Nav.Link>

                {/* Бургер-меню (MDB) с аватаром */}
                <MDBNavbar expand="lg" light bgColor="light" className="p-0 m-0 border-0">
                  <MDBContainer fluid className="p-0 m-0">
                    <MDBNavbarToggler
                      aria-controls="navbarExample01"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                      onClick={() => setShowNav(!showNav)}
                    >
                      <i className="fas fa-bars"></i>
                    </MDBNavbarToggler>

                    <MDBCollapse navbar show={showNav}>
                      <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
                        <MDBNavbarItem className="ms-3">
                          <Link to="/profile">
                            <MDBCardImage
                              src={`http://localhost:5000${avatarPath}?v=${Date.now()}`}
                              alt="avatar"
                              className="rounded-circle"
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover'
                              }}
                            />
                          </Link>
                        </MDBNavbarItem>
                      </MDBNavbarNav>
                    </MDBCollapse>
                  </MDBContainer>
                </MDBNavbar>

                {/* Кнопка "Выйти" */}
                <Button variant="light" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              // ---------- Блок для НЕавторизованного пользователя ----------
              <>
                {/* Только Информация и Помощь */}
                <Nav.Link as={Link} to="/about" className="text-primary fw-semibold">
                  <i className="bi bi-info-circle me-2"></i>Информация
                </Nav.Link>
                <Nav.Link as={Link} to="/help" className="text-primary fw-semibold">
                  <i className="bi bi-question-circle me-2"></i>Помощь
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
