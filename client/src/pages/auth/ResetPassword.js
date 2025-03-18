import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ResetPassword = ({ sharedEmail }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [resetEmail, setResetEmail] = useState(sharedEmail || '');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setResetEmail(sharedEmail);
  }, [sharedEmail]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/reset-password',
        { email: resetEmail, resetToken, newPassword }
      );
      setResetMessage(res.data.message);
      setIsAuthenticated(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Хатолик юз берди');
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Сброс пароля</h3>
      {resetMessage && <Alert variant="success" className="mt-3">{resetMessage}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <Form onSubmit={handleResetPassword}>
        <Form.Group className="mb-3">
          <Form.Label>Электрон почта</Form.Label>
          <Form.Control
            type="email"
            placeholder="Электрон почта"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Тасдиқлаш коди</Form.Label>
          <Form.Control
            type="text"
            placeholder="Тасдиқлаш коди"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Янги парол</Form.Label>
          <Form.Control
            type="password"
            placeholder="Янги парол"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Паролни ўзгартириш
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;
