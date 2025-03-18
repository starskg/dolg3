// routes/pricelistRoutes.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // ваш пул соединений MySQL

// 1. GET /api/pricelists - Получить все прайс-листы
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pricelists ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении прайс-листов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении прайс-листов' });
  }
});

// 2. POST /api/pricelists - Создать новый прайс-лист
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Не указано название прайс-листа' });
  }

  try {
    const [result] = await pool.query('INSERT INTO pricelists (title) VALUES (?)', [title]);
    res.status(201).json({
      id: result.insertId,
      title,
      created_at: new Date(), // или значение из БД
    });
  } catch (error) {
    console.error('Ошибка при создании прайс-листа:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании прайс-листа' });
  }
});

// 3. GET /api/pricelists/:id - Получить один прайс-лист по ID, вместе с товарами
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Сначала получаем сам прайс-лист
    const [pricelistRows] = await pool.query('SELECT * FROM pricelists WHERE id = ?', [id]);
    if (pricelistRows.length === 0) {
      return res.status(404).json({ message: 'Прайс-лист не найден' });
    }

    const pricelist = pricelistRows[0];

    // Затем получаем товары, привязанные к этому прайс-листу
    const [productsRows] = await pool.query('SELECT * FROM products WHERE price_list_id = ?', [id]);

    // Возвращаем общую структуру
    res.json({
      id: pricelist.id,
      title: pricelist.title,
      created_at: pricelist.created_at,
      products: productsRows,
    });
  } catch (error) {
    console.error('Ошибка при получении прайс-листа:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении прайс-листа' });
  }
});

// 4. PUT /api/pricelists/:id - Обновить прайс-лист (название и товары)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, products } = req.body; // ожидаем { title, products: [...] }

  try {
    // Проверяем, что прайс-лист существует
    const [pricelistRows] = await pool.query('SELECT * FROM pricelists WHERE id = ?', [id]);
    if (pricelistRows.length === 0) {
      return res.status(404).json({ message: 'Прайс-лист не найден' });
    }

    // Если передано новое название, обновляем
    if (title !== undefined) {
      await pool.query('UPDATE pricelists SET title = ? WHERE id = ?', [title, id]);
    }

    // Если передан массив товаров, заменяем их
    if (Array.isArray(products)) {
      // Удаляем старые товары
      await pool.query('DELETE FROM products WHERE price_list_id = ?', [id]);

      // Вставляем новые
      for (const product of products) {
        const { name, weight, pricePerKg, discountPrice } = product;

        // Проверяем, что обязательные поля не пустые
        if (!name || !weight || !pricePerKg || !discountPrice) {
          // Можете либо пропустить, либо вернуть ошибку
          // В данном примере просто пропустим такой товар
          continue;
        }

        // Вставляем в таблицу products
        await pool.query(
          `INSERT INTO products (price_list_id, name, weight, price_per_kg, discount_price)
           VALUES (?, ?, ?, ?, ?)`,
          [id, name, weight, pricePerKg, discountPrice]
        );
      }
    }

    // Возвращаем обновлённый прайс-лист
    // Повторно делаем запрос, чтобы отдать актуальные данные
    const [updatedPricelistRows] = await pool.query('SELECT * FROM pricelists WHERE id = ?', [id]);
    const updatedPricelist = updatedPricelistRows[0];

    const [updatedProductsRows] = await pool.query('SELECT * FROM products WHERE price_list_id = ?', [id]);

    res.json({
      id: updatedPricelist.id,
      title: updatedPricelist.title,
      created_at: updatedPricelist.created_at,
      products: updatedProductsRows,
    });
  } catch (error) {
    console.error('Ошибка при обновлении прайс-листа:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении прайс-листа' });
  }
});

module.exports = router;
