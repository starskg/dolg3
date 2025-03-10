import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Spinner, Table } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  

  // Valyuta kurslari uchun state
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const config = {
          headers: {
            Authorization: "Bearer L92QpyvzJ4mBtFlZHbp7jWrlBfCB1twjIPkiNWV01221a81d",
          },
        };
        const response = await axios.get("https://data.fx.kg/api/v1/average", config);
        // API javobidagi qiymatlarni raqamga aylantiramiz:
        setRates({
          USD: { buy: parseFloat(response.data.buy_usd), sell: parseFloat(response.data.sell_usd) },
          EUR: { buy: parseFloat(response.data.buy_eur), sell: parseFloat(response.data.sell_eur) },
          RUB: { buy: parseFloat(response.data.buy_rub), sell: parseFloat(response.data.sell_rub) },
          KZT: { buy: parseFloat(response.data.buy_kzt), sell: parseFloat(response.data.sell_kzt) },
        });
        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки валют:", error);
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container>
        <Row className="justify-content-center">
          {/* Валюта курслари (Чап томонда) */}
          <Col md={4} className="d-flex align-items-center justify-content-center">
            <Card className="shadow-sm border-0 rounded text-center p-3 w-100" style={{ maxWidth: "350px" }}>
              <Card.Body>
                <h5 className="fw-bold">Курс валют</h5>
                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <Table striped bordered hover size="sm" className="mt-2">
                    <thead>
                      <tr>
                        <th>Валюта</th>
                        <th>Покупка</th>
                        <th>Продажа</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rates && (
                        <>
                          <tr>
                            <td>$ USD</td>
                            <td>{rates.USD.buy.toFixed(2)}</td>
                            <td>{rates.USD.sell.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>€ EUR</td>
                            <td>{rates.EUR.buy.toFixed(2)}</td>
                            <td>{rates.EUR.sell.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>₽ RUB</td>
                            <td>{rates.RUB.buy.toFixed(2)}</td>
                            <td>{rates.RUB.sell.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>₸ KZT</td>
                            <td>{rates.KZT.buy.toFixed(2)}</td>
                            <td>{rates.KZT.sell.toFixed(2)}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Логин формаси (Ўнг томонда) */}
          <Col md={6}>
            <Card className="shadow-sm border-0 rounded text-center p-4 mx-auto" style={{ maxWidth: "400px" }}>
              <Card.Body>
                <h2 className="fw-bold mb-3">Система учёта долгов</h2>
                <p className="text-muted">Управляйте долгами легко и удобно</p>
                <Button
                  variant="outline-dark"
                  className="d-flex align-items-center justify-content-center gap-2 w-100 py-2 mt-3"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle size={22} /> Войти через Google
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
