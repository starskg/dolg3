import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/auth/facebook';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Xatoliklarni tozalash
      setError(null);

      await axios.post(
        'http://localhost:5000/auth/login',
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Неверный email или пароль');
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Система учёта долгов</h3>
      
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Электрон почта</Form.Label>
          <Form.Control
            type="email"
            placeholder="Электрон почта"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Пароль"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Войти
        </Button>
      </Form>
      
      <hr className="my-4" />
      <p className="text-center mb-2 fw-bold">Вход через</p>
      <div className="d-flex justify-content-between">
        <Button variant="outline-primary" onClick={handleGoogleLogin} className="me-2 w-50">
          <FcGoogle size={22} className="me-2" />
          Google
        </Button>
        <Button variant="outline-primary" onClick={handleFacebookLogin} className="ms-2 w-50">
          <FaFacebook size={22} className="me-2" />
          Facebook
        </Button>
      </div>
      <div className="text-center mt-3">
        <a href="/register">Регистрация</a>
      </div>
    </div>
  );
};

export default LoginForm;
