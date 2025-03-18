import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';


const Register = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== confirmPassword) {
      setRegError('Пароли не совпадают!');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/auth/register',
        { name, email: regEmail, password: regPassword },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      setRegError(error.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Регистрация</h3>
      {regError && <p className="text-danger text-center">{regError}</p>}
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Повторно введите пароль</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Зарегистрироваться
        </Button>
      </Form>
      <div className="text-center mt-3">
        <a href="/login">или войти</a>
      </div>
    </div>
  );
};

export default Register;
