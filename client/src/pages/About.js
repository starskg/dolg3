import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";


const About = () => {
  const navigate = useNavigate(); // 🚀 Навигацияни юклаймиз
  return (
    <div className="container mt-5">
       <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Назад
      </Button>
      
      <h2>Трекер долгов</h2>
      <p>
      Этот проект помогает пользователям управлять своей задолженностью. У вас есть несколько
      Вы можете использовать функции для отслеживания выданных и полученных вами займов.
      </p>
      <p>
      Если у вас есть вопросы, вы можете связаться с нами:
        <br />
        Email: support@debttracker.com
      </p>
    </div>
  );
};

export default About;