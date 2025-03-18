// PriceListDetail.js
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Container, Table, Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const PriceListDetail = () => {
  const { id } = useParams(); // ID прайс‑листа из URL
  const navigate = useNavigate();
  const { state } = useLocation(); // получаем переданный state

  const [loading, setLoading] = useState(true);
  const [priceListTitle, setPriceListTitle] = useState(state?.title || ''); // Название прайс‑листа
  const [products, setProducts] = useState([]); // Товары

  // Состояние для отслеживания редактируемой ячейки:
  // объект вида { rowIndex, field } или null
  const [editingField, setEditingField] = useState(null);

  // Новые поля для добавления товара
  const [newProduct, setNewProduct] = useState({
    name: '',
    weight: '',
    pricePerKg: '',
    discountPrice: '',
  });

  const tableRef = useRef(null);

  // Загружаем данные прайс‑листа с сервера при монтировании
  useEffect(() => {
    if (!state?.title) {
      fetchPriceList();
    } else {
      fetchPriceListProducts();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchPriceList = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pricelists/${id}`);
      const { title, products } = response.data;
      setPriceListTitle(title);
      setProducts(products || []);
    } catch (error) {
      console.error('Ошибка при получении прайс‑листа:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceListProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pricelists/${id}`);
      const { products } = response.data;
      setProducts(products || []);
    } catch (error) {
      console.error('Ошибка при получении товаров прайс‑листа:', error);
    } finally {
      setLoading(false);
    }
  };

  // Сохранить (обновить) прайс‑лист на сервере
  const savePriceList = async (updatedProducts) => {
    try {
      await axios.put(`http://localhost:5000/api/pricelists/${id}`, {
        title: priceListTitle, // название не меняется
        products: updatedProducts,
      });
    } catch (error) {
      console.error('Ошибка при обновлении прайс‑листа:', error);
    }
  };

  // Добавить новый товар
  const addProduct = async () => {
    const { name, weight, pricePerKg, discountPrice } = newProduct;
    if (name && weight && pricePerKg && discountPrice) {
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setNewProduct({ name: '', weight: '', pricePerKg: '', discountPrice: '' });
      await savePriceList(updatedProducts);
    } else {
      alert('Пожалуйста, заполните все поля.');
    }
  };

  // Обработчик изменения значения в ячейке
  const handleFieldChange = (rowIndex, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[rowIndex] = { ...updatedProducts[rowIndex], [field]: value };
    setProducts(updatedProducts);
  };

  // Завершение редактирования: закрываем редактирование и сохраняем изменения
  const finishEditing = async () => {
    setEditingField(null);
    await savePriceList(products);
  };

  // Удаление продукта из списка
  const deleteProduct = async (rowIndex) => {
    const updatedProducts = products.filter((_, idx) => idx !== rowIndex);
    setProducts(updatedProducts);
    await savePriceList(updatedProducts);
  };

  // Функции экспорта остаются без изменений
  const exportToPNG = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'price-list.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const exportToPDF = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('price-list.pdf');
      });
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('ru-KG', {
      style: 'currency',
      currency: 'kgs', // или другая нужная валюта
    }).format(value);
  

  return (
    <Container className="mt-5">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/pricelist')}>
        Назад
      </Button>

      {/* Отображение названия прайс‑листа */}
      <h2 className="mb-4 text-center">
        Прайс‑лист <span style={{ fontWeight: 'bold' }}>{priceListTitle}</span>
      </h2>

      {/* Блок, который будет экспортироваться */}
      <div ref={tableRef}>
        <Table bordered responsive className="text-center">
          <thead>
            <tr>
              <th className="bg-info text-white">Наименование</th>
              <th className="bg-success text-white">Вес (кг)</th>
              <th className="bg-warning text-white">Цена за 1 кг</th>
              <th className="bg-danger text-white">Цена со скидкой!</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {products.map((product, index) => (
    <tr key={index}>
      {/* Ячейки становятся редактируемыми по клику */}
      <td
        onClick={() => setEditingField({ rowIndex: index, field: 'name' })}
        style={{ cursor: 'pointer' }}
      >
        {editingField?.rowIndex === index && editingField.field === 'name' ? (
          <Form.Control
            value={product.name}
            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
            onBlur={finishEditing}
            autoFocus
          />
        ) : (
          product.name
        )}
      </td>
      <td
        onClick={() => setEditingField({ rowIndex: index, field: 'weight' })}
        style={{ cursor: 'pointer' }}
      >
        {editingField?.rowIndex === index && editingField.field === 'weight' ? (
          <Form.Control
            type="number"
            value={product.weight}
            onChange={(e) => handleFieldChange(index, 'weight', e.target.value)}
            onBlur={finishEditing}
            autoFocus
          />
        ) : (
          product.weight
        )}
      </td>
      <td
        onClick={() => setEditingField({ rowIndex: index, field: 'price_per_kg' })}
        style={{ cursor: 'pointer' }}
      >
        {editingField?.rowIndex === index && editingField.field === 'price_per_kg' ? (
          <Form.Control
            type="number"
            value={product.price_per_kg}
            onChange={(e) => handleFieldChange(index, 'price_per_kg', e.target.value)}
            onBlur={finishEditing}
            autoFocus
          />
        ) : (
          formatCurrency(product.price_per_kg)
        )}
      </td>
      <td
        onClick={() => setEditingField({ rowIndex: index, field: 'discount_price' })}
        style={{ cursor: 'pointer' }}
      >
        {editingField?.rowIndex === index && editingField.field === 'discount_price' ? (
          <Form.Control
            type="number"
            value={product.discount_price}
            onChange={(e) => handleFieldChange(index, 'discount_price', e.target.value)}
            onBlur={finishEditing}
            autoFocus
          />
        ) : (
          formatCurrency(product.discount_price)
        )}
      </td>
      <td>
        <Button variant="danger" size="sm" onClick={() => deleteProduct(index)}>
          Удалить
        </Button>
      </td>
    </tr>
  ))}
</tbody>
        </Table>
      </div>

      {/* Форма для добавления нового товара */}
      <Form className="mt-4">
        <Row className="g-2">
          <Col md={3}>
            <Form.Control
              type="text"
              name="name"
              placeholder="Наименование"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="weight"
              placeholder="Вес (кг)"
              value={newProduct.weight}
              onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="pricePerKg"
              placeholder="Цена за 1кг"
              value={newProduct.pricePerKg}
              onChange={(e) => setNewProduct({ ...newProduct, pricePerKg: e.target.value })}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="discountPrice"
              placeholder="Цена со скидкой!"
              value={newProduct.discountPrice}
              onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
            />
          </Col>
        </Row>
        <Button variant="primary" className="mt-3" onClick={addProduct}>
           Добавить продукт
        </Button>
      </Form>

      {/* Кнопки экспорта */}
      <Row className="mt-4">
        <Col md={6}>
          <Button variant="outline-primary" onClick={exportToPNG} className="w-100">
            Экспорт PNG
          </Button>
        </Col>
        <Col md={6}>
          <Button variant="outline-secondary" onClick={exportToPDF} className="w-100">
            Экспорт PDF
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PriceListDetail;
