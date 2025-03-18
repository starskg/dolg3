import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import LoginForm from './LoginForm';
import RegisterForm from './Register';
import ForgotPasswordForm from './ForgotPassword';
import ResetPasswordForm from './ResetPassword';

const AuthCard = () => {
  // activeView: 'login', 'register', 'forgot', 'reset'
  const [activeView, setActiveView] = useState('login');
  // Foydalanuvchi kiritgan emailni saqlash uchun state
  const [sharedEmail, setSharedEmail] = useState('');

  return (
    <Card style={{ width: 'auto', maxWidth: '360px' }}>
      <Card.Body className="p-4">
        {activeView === 'login' && <LoginForm />}
        {activeView === 'register' && <RegisterForm />}
        {activeView === 'forgot' && (
          <ForgotPasswordForm 
            setActiveView={setActiveView} 
            setSharedEmail={setSharedEmail} 
          />
        )}
        {activeView === 'reset' && (
          <ResetPasswordForm sharedEmail={sharedEmail} />
        )}

        <Nav
          variant="tabs"
          activeKey={activeView}
          onSelect={(selectedKey) => setActiveView(selectedKey)}
          className="mt-4 justify-content-center"
        >
          {activeView !== 'login' && (
            <Nav.Item>
              <Nav.Link eventKey="login">Войти</Nav.Link>
            </Nav.Item>
          )}
          <Nav.Item>
            <Nav.Link eventKey="register">Регистрация</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="forgot">Восстановление</Nav.Link>
          </Nav.Item>
          
        </Nav>
      </Card.Body>
    </Card>
  );
};

export default AuthCard;