import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ExchangeRates from './ExchangeRates';
import { Helmet } from 'react-helmet';


/* Bootstrap komponentlari */
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Пароллар мос келмайди!");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/auth/register",
        { name, email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Рўйхатдан ўтишда хатолик");
    }
  };

  return (

    <div>
      <Helmet>
        <title>Регистрация</title>
      </Helmet>
    <Container
        className="min-vh-100 d-flex align-items-center"
        style={{ maxWidth: '1200px' }}
    >
      <Row className="w-100 mx-auto">
        <Col xs={12} md={4} className="mb-4 d-flex align-items-center justify-content-start">
        <ExchangeRates />
        </Col>
        
      
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Регистрация</h3>

              {error && <p className="text-danger text-center">{error}</p>}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Register;
