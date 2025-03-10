const mysql = require('mysql2/promise');

// Подключение к базе MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1', // Для OpenServer используйте 127.0.0.1 или localhost
  user: process.env.DB_USER || 'root',      // Имя пользователя (для OpenServer "root")
  password: process.env.DB_PASSWORD || 'root',  // Пароль (если пароля нет, оставьте пустым)
  database: process.env.DB_NAME || 'my_debt_tracker', // Название базы данных
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Тестирование подключения
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Ошибка подключения к базе MySQL:', err);
    return;
  }
  console.log('Успешное подключение к базе MySQL!');
  connection.release();
});

module.exports = pool;
