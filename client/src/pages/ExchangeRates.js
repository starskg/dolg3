import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Курс валюта</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Валюта</th>
              <th className="border border-gray-300 px-4 py-2">Покупка</th>
              <th className="border border-gray-300 px-4 py-2">Продажа</th>
            </tr>
          </thead>
          <tbody>
            {rates && (
              Object.keys(rates).map((currency) => (
                <tr key={currency} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{currency}</td>
                  <td className="border border-gray-300 px-4 py-2">{rates[currency].buy.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{rates[currency].sell.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExchangeRates;
