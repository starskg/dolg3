import React from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col } from 'react-bootstrap';
import AuthCard from '../pages/auth/AuthCard'; 
import ExchangeRates from '../pages/ExchangeRates'; // Agar kerak bo'lsa

const Login = () => {
  return (
    <div>
      <Helmet>
        <title>Система учёта долгов</title>
      </Helmet>
      
      {/* Sahifani butun balandlik bo'yicha markazga joylashtirish */}
      <Container fluid className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
        
        {/* Agar ExchangeRates ni ham chapda ko'rsatmoqchi bo'lsangiz: */}
        <Row className="w-100">
          <Col xs={12} md={4} className="d-flex justify-content-center mb-4">
            <ExchangeRates />
          </Col>
          
          <Col xs={12} md={8} className="d-flex justify-content-center">
            <AuthCard />
          </Col>
        </Row>
        
        {/* Yoki faqat bitta col'da AuthCard bo'lsin desangiz, Row va Col'ni shunday qilasiz:
        <Row>
          <Col className="d-flex justify-content-center">
            <AuthCard />
          </Col>
        </Row>
        */}
        
      </Container>
    </div>
  );
};

export default Login;
