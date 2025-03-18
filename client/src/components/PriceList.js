// PriceLists.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PriceLists = () => {
  const navigate = useNavigate();

  const [priceLists, setPriceLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Модалка для создания нового прайс‑листа
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchPriceLists();
  }, []);

  // Получаем список прайс‑листов
  const fetchPriceLists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pricelists');
      setPriceLists(response.data);
    } catch (error) {
      console.error('Ошибка при получении прайс‑листов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Открыть/закрыть модалку создания
  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewTitle('');
  };

  // Создать новый прайс‑лист
  const handleCreatePriceList = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/pricelists', { title: newTitle });
      // Переход на страницу деталей нового прайс‑листа
      navigate(`/pricelists/${response.data.id}`, { state: { title: newTitle } });
      // Обновляем список локально (если требуется)
      setPriceLists([...priceLists, response.data]);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Ошибка при создании прайс‑листа:', error);
    }
  };

  // Переход к детальному просмотру
  const handleOpenPriceList = (id) => {
    navigate(`/pricelists/${id}`);
  };

  // Удаление прайс‑листа (предполагается, что API для удаления реализовано)
  const handleDeletePriceList = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pricelists/${id}`);
      setPriceLists(priceLists.filter((pl) => pl.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении прайс‑листа:', error);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <p>Загрузка...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {priceLists.length === 0 ? (
        <div className="text-center">
          <h4>Нет прайс‑листов. Создайте новый!</h4>
          <Button variant="primary" onClick={handleOpenCreateModal}>
            Создать прайс‑лист
          </Button>
        </div>
      ) : (
        <>
          <h2 className="mb-3">Списки прайс‑листов</h2>
          <Table bordered hover style={{ tableLayout: 'fixed', width: '100%' }}>
  <colgroup>
    <col style={{ width: '50px' }} />
    <col />
    <col style={{ width: '90px' }} />
  </colgroup>
  <thead>
    <tr style={{ backgroundColor: 'rgb(158, 158, 158)' }}>
      <th>#</th>
      <th>Название</th>
      <th>Действия</th>
    </tr>
  </thead>
  <tbody>
    {priceLists.map((pl, index) => (
      <tr
        key={pl.id}
        onClick={() => handleOpenPriceList(pl.id)}
        style={{ cursor: 'pointer', backgroundColor: 'rgba(250, 250, 250, 0.69)' }}
      >
        <td className="text-center">{index + 1}</td>
        <td>{pl.title}</td>
        <td style={{ textAlign: 'center' }}>
          <Button
            variant="outline-danger"
            size="sm"
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePriceList(pl.id);
            }}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>


          <Button variant="success" onClick={handleOpenCreateModal}>
            Создать прайс‑лист
          </Button>
        </>
      )}

      {/* Модальное окно для создания нового прайс‑листа */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Создать новый прайс‑лист</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatePriceList}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                placeholder="Например, «Прайс‑лист Меиз»"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Создать
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PriceLists;
