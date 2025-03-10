const db = require('../config/db');

// Получение всех долгов
exports.getAllDebts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM debts WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка' });
  }
};

// Добавление нового долга
exports.addDebt = async (req, res) => {
  const { debtor_name, amount, type, comment, date } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Пользователь не подтверждён' });
  }

  try {
    // ✅ Базада ном мавжудлигини текшириш
    const [existingDebts] = await db.query(
      'SELECT * FROM debts WHERE user_id = ? AND debtor_name = ?',
      [req.user.id, debtor_name]
    );

    if (existingDebts.length > 0) {
      return res.status(400).json({ message: '❌ Такой должник уже существует!' });
    }

    await db.query(
      'INSERT INTO debts (user_id, debtor_name, amount, type, comment, date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, debtor_name, amount, type, comment, date]
    );

    res.status(201).json({ message: 'Долг успешно добавлен' });
  } catch (error) {
    console.error('Ошибка при сохранении долга:', error);
    res.status(500).json({ message: 'Произошла ошибка' });
  }
};

// Редактирование долга
exports.updateDebt = async (req, res) => {
  const { id } = req.params;
  const { debtor_name, amount, type, comment, date } = req.body;

  console.log("📥 SERVER: RECEIVED DATE FROM CLIENT:", date);

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Некорректный ID" });
  }

  // ✅ Агар `date` эски бўлса, сервер ҳозирги вақтни қўйиб юборади
  const localDate = date ? new Date(date) : new Date();
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  const formattedDate = localDate.toISOString().slice(0, 19).replace('T', ' '); // ✅ "YYYY-MM-DD HH:mm:ss"

  console.log("📤 SERVER: FORMATTED DATE FOR DATABASE:", formattedDate);

  try {
    const [result] = await db.query(
      'UPDATE debts SET debtor_name = ?, amount = ?, type = ?, comment = ?, date = ? WHERE id = ? AND user_id = ?',
      [debtor_name, amount, type, comment, formattedDate, id, req.user.id]
    );

    console.log("✅ SERVER: UPDATE SUCCESSFUL!");
    res.json({ message: 'Долг успешно отредактирован' });
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    res.status(500).json({ message: 'Произошла ошибка', error: error.message });
  }
};




// controllers/debtController.js
exports.addDebtorDetail = async (req, res) => {
  try {
    const newDebtor = req.body;
    // Логика для добавления нового должника в базу данных
    res.status(201).json({ message: 'Должник успешно создан', debtor: newDebtor });
  } catch (error) {
    console.error("Ошибка при создании должника:", error);
    res.status(500).json({ message: "Произошла ошибка" });
  }
};




// Удаление долга
exports.deleteDebt = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM debts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Долг успешно удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Произошла ошибка' });
  }
};


exports.updateDebtorDetail = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    // Например, обновляем запись в таблице debts для текущего пользователя.
    const [result] = await db.query(
      'UPDATE debts SET ? WHERE id = ? AND user_id = ?',
      [updatedData, id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Должник не найден" });
    }
    res.json({ message: 'Данные должника успешно обновлены' });
  } catch (error) {
    console.error("Ошибка при обновлении данных должника:", error);
    res.status(500).json({ message: "Произошла ошибка при обновлении" });
  }
};
exports.addTransaction = async (req, res) => {
  const { id } = req.params; // debt_id: debts jadvalidagi ID
  const { type, amount, comment } = req.body;

  try {
    // 1. transactions jadvaliga yangi tranzaksiya qo'shamiz, endi comments ustuni ham bor
    const [insertResult] = await db.query(
      'INSERT INTO transactions (debt_id, type, amount, date, comments) VALUES (?, ?, ?, NOW(), ?)',
      [id, type, amount, comment]
    );

    // 2. debts jadvalidagi asosiy summani yangilash
    const operator = type === 'plus' ? '+' : '-';
    await db.query(
      `UPDATE debts SET amount = amount ${operator} ? WHERE id = ?`,
      [amount, id]
    );

    res.status(201).json({ message: 'Транзакция успешно добавлена', transactionId: insertResult.insertId });
  } catch (error) {
    console.error('Ошибка при добавлении транзакции:', error);
    res.status(500).json({ message: 'Произошла ошибка при добавлении транзакции' });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id, transactionId } = req.params; // id - debts jadvalidagi ID, transactionId - o'chiriladigan transaction ID
  try {
    // 1. O'chirilayotgan tranzaksiyaning type va amount qiymatlarini bazadan o'qib olamiz:
    const [rows] = await db.query(
      'SELECT type, amount FROM transactions WHERE id = ? AND debt_id = ?',
      [transactionId, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }
    const { type, amount } = rows[0];

    // 2. Tranzaksiyani transactions jadvalidan o'chiramiz:
    await db.query(
      'DELETE FROM transactions WHERE id = ? AND debt_id = ?',
      [transactionId, id]
    );

    // 3. Asosiy summani yangilash uchun teskari amalni bajarish:
    //    Agar type = "plus" bo'lsa, oldin asosiy summaga qo'shilgan => endi ayirish kerak,
    //    Agar type = "minus" bo'lsa, oldin asosiy summadan ayirilgan => endi qo'shish kerak.
    let operator = '-';
    if (type === 'minus') {
      operator = '+';
    }

    await db.query(
      `UPDATE debts SET amount = amount ${operator} ? WHERE id = ?`,
      [amount, id]
    );

    res.json({ message: 'Транзакция успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении транзакции:', error);
    res.status(500).json({ message: 'Произошла ошибка при удалении транзакции' });
  }
};




exports.getDebtorDetail = async (req, res) => {
  const { id } = req.params;
  try {
    // Получаем данные должника
    const [debtorRows] = await db.query('SELECT * FROM debts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (debtorRows.length === 0) {
      return res.status(404).json({ message: 'Должник не найден' });
    }
    const debtor = debtorRows[0];

    // Получаем транзакции для данного должника (предполагается, что debt_id хранится в таблице transactions)
    const [transactionsRows] = await db.query('SELECT * FROM transactions WHERE debt_id = ? ORDER BY date DESC', [id]);

    res.json({
      debtor,
      transactions: transactionsRows
    });
  } catch (error) {
    console.error("Ошибка при получении деталей должника:", error);
    res.status(500).json({ message: "Произошла ошибка при получении деталей" });
  }
};

