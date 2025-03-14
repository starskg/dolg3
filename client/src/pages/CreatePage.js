// src/pages/CreatePage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/admin/pages',
        { title, content, link },
        { withCredentials: true }
      );
      setMessage('Страница успешно создана!');
      setTitle('');
      setContent('');
      setLink('');
    } catch (error) {
      console.error("Ошибка при создании страницы:", error);
      setMessage('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="my-4">
      <h2>Создать новую страницу</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Заголовок</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите заголовок страницы"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formContent" className="mt-3">
          <Form.Label>Контент</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Введите контент страницы"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLink" className="mt-3">
          <Form.Label>Ссылка (URL)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите ссылку страницы"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Создать страницу
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePage;
