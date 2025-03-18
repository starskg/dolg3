import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ForgotPassword = ({ setActiveView, setSharedEmail }) => {
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/forgot-password',
        { email: forgotEmail }
      );
      if (res.data && res.data.message) {
        // Emailni sharedEmail ga saqlaymiz:
        setSharedEmail(forgotEmail);
        // Formani "reset" holatiga o‘zgartiramiz:
        setActiveView('reset');
      } else {
        setError('От сервера получен недействительный ответ.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка.');
    }
  };

  return (
    <div>
      <h3 className="text-center mb-4">Восстановление пароля</h3>
      <Form onSubmit={handleForgotPassword}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Введите электронную почту"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Отправить код подтверждения
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default ForgotPassword;
