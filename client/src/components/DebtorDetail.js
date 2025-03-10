import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Table, Form, ListGroup } from "react-bootstrap";


// Форматлаш функцияси: "26.02.2025"
const formatDate = (dateInput) => {
  const d = new Date(dateInput);
  return d.toLocaleDateString();
};

const DebtorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debtor, setDebtor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  // **Транзакция киритиш учун ҳолат**
  const [showInput, setShowInput] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionComment, setTransactionComment] = useState("");

  // **Должник ва транзакцияларни олиш**
  const fetchDebtorDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/debts/${id}`, {
        withCredentials: true,
      });
      setDebtor(response.data.debtor);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Ошибка получения данных должника:", error);
    }
  };

  useEffect(() => {
    fetchDebtorDetails();
  }, [id]);

  // **Транзакция қўшиш**
  const handleAddTransaction = async () => {
    const txAmount = parseFloat(transactionAmount);
    if (isNaN(txAmount) || txAmount <= 0) {
      setMessage("❌ Неверная сумма!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/debts/${id}/transactions`,
        { type: transactionType, amount: txAmount, comment: transactionComment },
        { withCredentials: true }
      );

      setMessage(`${txAmount} сом успешно добавлен!`);
      fetchDebtorDetails();
      setShowInput(false);
      setTransactionAmount("");
      setTransactionComment("");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("❌ Ошибка при добавлении транзакции:", error);
      setMessage("❌ Ошибка при добавлении транзакции!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!debtor) {
    return <div className="text-center">Загрузка данных должника...</div>;
  }
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/debts/${debtor.id}/transactions/${transactionId}`, { withCredentials: true });
      // O'chirilgandan so'ng tranzaksiyalar ro'yxatini yangilash:
      fetchDebtorDetails();
    } catch (error) {
      console.error("Ошибка при удалении транзакции:", error);
    }
  };
// 1. Transactions ni sanaga qarab guruhlash
const groupedByDate = transactions.reduce((acc, tx) => {
  const d = formatDate(tx.date); // Masalan, "09.03.2025"
  if (!acc[d]) acc[d] = [];
  acc[d].push(tx);
  return acc;
}, {});

  return (
    <div className="container mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Назад
      </Button>

      {/* СУММА КАТТА ШРИФТ БИЛАН */}
      <Card
        className={`card text-white mb-3 text-center shadow-lg rounded ${debtor.type === "given" ? "bg-success" : "bg-danger"
          }`}
        style={{ maxWidth: "100rem" }}
      >
        <h2 className="card-header">
          <i className="bi-person-fill me-2"></i>
          {debtor.debtor_name}
        </h2>
        <h5 className="card-body">
          {debtor.type === "given" ? "Мне должны" : "Я должен"}:{" "}
          <span style={{ fontSize: "2rem", display: "inline" }}>
            {debtor.amount} <span className="card-text">сом</span>
          </span>
        </h5>
      </Card>

      <div className="d-flex justify-content-center gap-3 mt-3">
        <Button
          variant="outline-success"
          className="shadow-sm rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "45px", height: "45px" }}
          onClick={() => {
            setTransactionType("plus");
            setShowInput(true);
          }}
        >
          <i className="bi bi-plus fs-3"></i>
        </Button>
        <Button
          variant="outline-danger"
          className="shadow-sm rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "45px", height: "45px" }}
          onClick={() => {
            setTransactionType("minus");
            setShowInput(true);
          }}
        >
          <i className="bi bi-dash fs-3"></i>
        </Button>
        <Button
          variant="warning"
          className="shadow-sm fs-5 fw-bold text-dark rounded-pill px-4"
          onClick={() => {
            // Погасить логикаси
          }}
        >
          Погасить
        </Button>
      </div>

      {/* Сообщение */}
      {message && (
        <div className="alert alert-info text-center mt-3" role="alert">
          {message}
        </div>
      )}

      {/* Сумма киритиш ва комментарий input'и */}
      {showInput && (
        <div className="mt-3">
          <Form>
            <Form.Group>
              <Form.Label>Введите сумму:</Form.Label>
              <Form.Control
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Комментарий (необязательно):</Form.Label>
              <Form.Control
                type="text"
                value={transactionComment}
                onChange={(e) => setTransactionComment(e.target.value)}
                placeholder="Добавьте комментарий..."
              />
            </Form.Group>
            <div className="d-flex justify-content-between mt-2">
              <Button variant="danger" onClick={() => setShowInput(false)}>
                Отмена
              </Button>
              <Button variant="success" onClick={handleAddTransaction}>
                Добавить
              </Button>
            </div>
          </Form>
        </div>
      )}

{/* Транзакциялар */}
<h4 className="mt-4">События</h4>
{transactions.length > 0 ? (
  Object.keys(groupedByDate).map((dateStr) => (
    <div key={dateStr} className="mb-3">
      <h5>{dateStr}</h5>
      <ListGroup>
        {groupedByDate[dateStr].map((tx) => (
          <ListGroup.Item key={tx.id} className="mb-2 shadow-sm">
            <div className="d-flex w-100 justify-content-between align-items-center">
              {/* Agar sanaga qarab guruhlayotgan bo‘lsangiz, bu yerda sana ko‘rsatish shart emas,
                  lekin formatDate(tx.date) bilan vaqtni ham ko‘rsatishingiz mumkin. */}
              <span
                className={
                  tx.type === "plus"
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {tx.type === "plus" ? "+ " : "- "}
                {tx.amount} сом
              </span>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteTransaction(tx.id)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
            {tx.comments && tx.comments.trim() !== "" && (
              <div className="mt-1">
                <small className="text-secondary d-block">
                  Комментарий: <span>{tx.comments}</span>
                </small>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  ))
) : (
  <p className="text-muted">Нет транзакций.</p>
)}

    </div>
  );
};

export default DebtorDetail;
