import React, { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import "../styles/ExchangeRates.css"; // Глассморфизм стили шу ерда

const ExchangeRates = () => {
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

  return (
    <Card className="exchange-rates-card">
      <Card.Body>
        <Card.Title className="exchange-rates-title">Курс валюта</Card.Title>

        {loading ? (
          <Spinner animation="border" variant="light" />
        ) : (
          <Table
            striped
            bordered
            hover
            size="sm"
            className="exchange-rates-table"
          >
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
                    <td>USD</td>
                    <td>{rates.USD.buy.toFixed(2)}</td>
                    <td>{rates.USD.sell.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>EUR</td>
                    <td>{rates.EUR.buy.toFixed(2)}</td>
                    <td>{rates.EUR.sell.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>RUB</td>
                    <td>{rates.RUB.buy.toFixed(2)}</td>
                    <td>{rates.RUB.sell.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>KZT</td>
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
  );
};

export default ExchangeRates;
