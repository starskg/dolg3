// controllers/adminController.js

const db = require('../config/db'); // Маълумотлар базаси конфигурациясига тегишли файл

// Саҳифаларни олиш
exports.getPages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pages'); // "pages" – саҳифалар таблицаси
    res.json(rows);
  } catch (error) {
    console.error("Ошибка получения страниц:", error);
    res.status(500).json({ message: 'Произошла ошибка при получении страниц' });
  }
};

// Янги саҳифа яратиш
exports.createPage = async (req, res) => {
  const { title, content, link } = req.body;
  try {
    await db.query(
      'INSERT INTO pages (title, content, link) VALUES (?, ?, ?)',
      [title, content, link]
    );
    res.status(201).json({ message: 'Саҳифа успешно создана' });
  } catch (error) {
    console.error("Ошибка создания страницы:", error);
    res.status(500).json({ message: 'Произошла ошибка при создании страницы' });
  }
};

// Саҳифани янгилаш
exports.updatePage = async (req, res) => {
  const { id } = req.params;
  const { title, content, link } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE pages SET title = ?, content = ?, link = ? WHERE id = ?',
      [title, content, link, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Саҳифа не найдена' });
    }
    res.json({ message: 'Саҳифа успешно обновлена' });
  } catch (error) {
    console.error("Ошибка обновления страницы:", error);
    res.status(500).json({ message: 'Произошла ошибка при обновлении страницы' });
  }
};

// Саҳифани ўчириш
exports.deletePage = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM pages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Саҳифа не найдена' });
    }
    res.json({ message: 'Саҳифа успешно удалена' });
  } catch (error) {
    console.error("Ошибка удаления страницы:", error);
    res.status(500).json({ message: 'Произошла ошибка при удалении страницы' });
  }
};

// Фойдаланувчиларни олиш
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error("Ошибка получения пользователей:", error);
    res.status(500).json({ message: 'Произошла ошибка при получении пользователей' });
  }
};

// Фойдаланувчини янгилаш
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const [result] = await db.query(
      'UPDATE users SET ? WHERE id = ?',
      [updatedData, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'Пользователь успешно обновлен' });
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error);
    res.status(500).json({ message: 'Произошла ошибка при обновлении пользователя' });
  }
};
