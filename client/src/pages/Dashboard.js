import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, InputGroup, Container, Row, Col, Pagination } from "react-bootstrap";
import AddDebtForm from "../components/AddDebtForm";
import DebtList from "../components/DebtList";
//import PlusButton from "../components/PlusButton";
import TopLink from "../components/TopLink";
import WelcMenu from "../components/WelcMenu";
import { Helmet } from 'react-helmet';




const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [debts, setDebts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Сахифада карздорлар сони
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);
  const [showMenu, setShowMenu] = useState(false);


  // ✅ Должник деталларига ўтиш
  const handleRowClick = (debt) => {
    navigate(`/debts/${debt.id}`);
  };

  // ✅ Фильтрлаш
  const filteredDebts = debts
    .filter((debt) => {
      if (filter === "all") return true;
      return debt.type === filter;
    })
    .filter((debt) => debt.debtor_name.toLowerCase().includes(searchTerm.toLowerCase()));

  // ✅ Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDebts = filteredDebts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // ✅ Фойдаланувчи маълумотларини олиш
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/debts", {
        withCredentials: true,
      });
      setDebts(response.data.reverse());
    } catch (error) {
      console.error("Error fetching debt data:", error);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleDeleteDebt = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/debts/${id}`, {
        withCredentials: true,
      });
      fetchDebts();
    } catch (error) {
      console.error("Error deleting debt:", error);
    }
  };

  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
    setSelectedType(debt.type);
  };

  const handleUpdateDebt = async (updatedDebt) => {
    updatedDebt.amount = parseFloat(updatedDebt.amount);
    updatedDebt.id = parseInt(updatedDebt.id);
    try {
      await axios.put(`http://localhost:5000/api/debts/${updatedDebt.id}`, updatedDebt, {
        withCredentials: true,
      });
      fetchDebts();
    } catch (error) {
      console.error("❌ ERROR UPDATING DEBT:", error);
    }
  };

  const totalAmount = debts.reduce(
    (sum, debt) => (debt.type === "taken" ? sum - parseFloat(debt.amount) : sum + parseFloat(debt.amount)),
    0
  );
  // 1. Mening olgan qarzlarim (Я должен)
  const myDebtsAmount = debts
    .filter((debt) => debt.type === "taken")
    .reduce((sum, debt) => sum + parseFloat(debt.amount), 0);

  // 2. Mening bergan qarzlarim (Я дал)
  const givenDebtsAmount = debts
    .filter((debt) => debt.type === "given")
    .reduce((sum, debt) => sum + parseFloat(debt.amount), 0);

  const handleCloseForm = () => {
    setEditingDebt(null);
    setSelectedType(null);
    setCurrentPage(1);
  };
  const handleAddDebt = async (formData) => {
    try {
      const userResponse = await axios.get("http://localhost:5000/api/user", { withCredentials: true });
      const userId = userResponse.data.id;
      await axios.post(
        "http://localhost:5000/api/debts",
        { ...formData, user_id: userId },
        { withCredentials: true }
      );
      fetchDebts(); // Yangi ma'lumotlarni olish
    } catch (error) {
      console.error("Ошибка при добавлении нового долга:", error);
    }
  };

  const totalPages = Math.ceil(filteredDebts.length / itemsPerPage);
  return (
    <div>
    <Helmet>
      <title>Дашборд</title>
    </Helmet>

    <Container  className="mt-4">
      <TopLink /> {/* Bu yerda tepada header bar ko'rsatiladi */}

      <div>
        <WelcMenu
          user={user}
          totalAmount={totalAmount}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          setSelectedType={setSelectedType}
          myDebtsAmount={myDebtsAmount}       // type === "taken"
          givenDebtsAmount={givenDebtsAmount} // type === "given"
        />
        {/* Qolgan dashboard qismi */}
        {(selectedType || editingDebt) && (
          <AddDebtForm
            onCancel={handleCloseForm}
            onUpdate={handleUpdateDebt}
            onAdd={handleAddDebt}
            defaultType={selectedType}
            editingDebt={editingDebt}
          />
        )}

      </div>

      {/* Filter va Qidiruv */}
      <Row className="mt-4">
        <Col md={6}>
          <div className="btn-group w-100">
            <Button variant={filter === "all" ? "primary" : "outline-primary"} onClick={() => setFilter("all")}>
              Все
            </Button>
            <Button variant={filter === "given" ? "success" : "outline-success"} onClick={() => setFilter("given")}>
              Мне должны
            </Button>
            <Button variant={filter === "taken" ? "danger" : "outline-danger"} onClick={() => setFilter("taken")}>
              Я должен
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">Поиск</Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Qarzdorlar ro'yhati */}
      <Row className="mt-3">
        <Col>
          {debts.length === 0 ? (
            <p className="text-muted fs-4 text-center">Долгов нет. Создайте его с помощью кнопки «+»!</p>
          ) : (
            <DebtList
              debts={currentDebts}
              onDelete={handleDeleteDebt}
              onEdit={handleEditDebt}
              onUpdate={handleUpdateDebt}
              onRowClick={handleRowClick}
              showDeleteIcon={true}
            />
          )}
        </Col>
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} />
      </Pagination>

    </Container>
    </div>
  );
};

export default Dashboard;