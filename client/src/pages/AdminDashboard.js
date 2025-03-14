// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "../components/AdminNav";
import PageList from "../components/PageList";
import UserList from "../components/UserList";
import { Container, Row, Col } from "react-bootstrap";

const AdminDashboard = () => {
  const [pages, setPages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchPages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pages", { withCredentials: true });
      setPages(res.data);
    } catch (error) {
      console.error("Ошибка получения страниц:", error);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", { withCredentials: true });
      setUsers(res.data);
    } catch (error) {
      console.error("Ошибка получения пользователей:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchPages();
    fetchUsers();
  }, []);

  // Callback для обновления страницы в списке
  const handlePageUpdated = (updatedPage) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.id === updatedPage.id ? updatedPage : page))
    );
  };

  // Callback для удаления страницы из списка
  const handlePageDeleted = (pageId) => {
    setPages((prevPages) => prevPages.filter((page) => page.id !== pageId));
  };

  return (
    <Container className="my-4">
      <AdminNav />
      <h1 className="mt-3 mb-4 text-center">Админ Панель</h1>
      <Row>
        <Col md={6}>
          <h2>Саҳифалар</h2>
          {loadingPages ? (
            <p>Загрузка страниц...</p>
          ) : (
            <PageList pages={pages} onPageUpdated={handlePageUpdated} onPageDeleted={handlePageDeleted} />
          )}
        </Col>
        <Col md={6}>
          <h2>Фойдаланувчилар</h2>
          {loadingUsers ? (
            <p>Загрузка пользователей...</p>
          ) : (
            <UserList users={users} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
