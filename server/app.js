require('dotenv').config(); // Активировать файл .env
const path = require('path');
const express = require('express');
const session = require('express-session'); // Импорт express-session
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const debtRoutes = require('./routes/debtRoutes');
const cors = require('cors'); // Импорт cors
const adminRoutes = require('./routes/adminRoutes');
const pricelistRoutes = require('./routes/pricelistRoutes');

const app = express();

// Настройка статики: файлы из папки 'uploads' будут доступны по URL '/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Конфигурация CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Адрес фронтенда пользователя
    credentials: true, // Разрешить cookies и данные сессий
  })
);

// Конфигурация сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key', // Секретный ключ (добавьте SESSION_SECRET в файл .env)
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Если используется HTTPS, установите "secure: true"
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session()); // Активировать сессию Passport

// Маршруты
app.use('/auth', authRoutes);
app.use('/api/debts', debtRoutes);
app.use('/debts', debtRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pricelists', pricelistRoutes);

// Маршрут для получения данных о пользователе
app.get('/api/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Пользователь не подтверждён' });
  }
  res.json(req.user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
