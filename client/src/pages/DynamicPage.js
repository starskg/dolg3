// src/pages/DynamicPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";

const DynamicPage = () => {
  const { link } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pages/${link}`);
        setPage(res.data);
      } catch (error) {
        console.error("Ошибка получения страницы:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [link]);

  if (loading) return <p>Загрузка страницы...</p>;
  if (!page) return <p>Страница не найдена</p>;

  return (
    <Container className="my-4">
      <h1>{page.title}</h1>
      <div>{page.content}</div>
    </Container>
  );
};

export default DynamicPage;
