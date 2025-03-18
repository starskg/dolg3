const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');



// Google OAuth маршрутлари (мавжуд)
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000', successRedirect: 'http://localhost:3000/dashboard' }));

// Facebook OAuth маршрутлари (янги)
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000', successRedirect: 'http://localhost:3000/dashboard' }));

// Фойдаланувчи маълумотлари
router.get('/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Пользователь не проверен.' });
  }
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar_url: req.user.avatar_url,
    mobile: req.user.mobile,
    address: req.user.address
  });
});


// Fayllarni 'uploads/' papkasiga saqlash uchun storage sozlamasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Bu papka serveringizda mavjud bo'lishi kerak
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// профилни янгилаш endpointi
router.post('/profile/update', upload.single('avatar'), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Фойдаланувчи тасдиқланмаган' });
  }

  // Formadan yuborilgan boshqa maydonlar
  const { name, email, mobile, address } = req.body;
  // Agar rasm yuklangan bo'lsa, uning yo'li, aks holda avvalgi avatar_url ni saqlaymiz
  const avatar_url = req.file ? req.file.path : req.user.avatar_url;

  try {
    await db.query(
      'UPDATE users SET name = ?, email = ?, avatar_url = ?, mobile = ?, address = ? WHERE id = ?',
      [name, email, avatar_url, mobile, address, req.user.id]
    );
    res.json({ message: 'Профиль муваффақиятли янгиланди' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Рўйхатдан ўтиш маршрути
router.post('/register', async (req, res) => {
  try {
    console.log("Запрос пришел.:", req.body); // Фойдаланувчи юборган маълумотни чиқарамиз

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Заполните все поля.' });
    }

    // Фойдаланувчи мавжуд ёки йўқлигини текшириш
    console.log("Отправка запроса MySQL...");
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      console.log("Пользователь уже существует.!");
      return res.status(400).json({ message: 'Этот адрес электронной почты уже существует.' });
    }

    // Паролни хэш қилиш
    console.log("Пароль хэшируется....");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Добавление нового пользователя в MySQL...");
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log("Добавлен новый пользователь:", result);

    const newUser = {
      id: result.insertId,
      name,
      email,
    };

    console.log("Пользователь автоматически входит в систему....");
    req.login(newUser, (err) => {
      if (err) {
        console.error("Ошибка входа:", err);
        return res.status(500).json({ message: 'Ошибка при входе в систему' });
      }
      res.json({ message: 'Регистрация прошла успешно.', user: newUser });
    });

  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Вход успешный' });
});

//Фойдаланувчи Паролни тиклаш
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (user.length === 0) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetExpires = Date.now() + 3600000; // 1 соат ишлайдиган код

  await db.query('UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?', 
                 [resetToken, resetExpires, email]);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Восстановление пароля',
    text: `Чтобы сбросить пароль, используйте следующий код: ${resetToken}`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({ message: 'Ошибка отправки электронного письма' });
    }
    res.json({ message: 'Код подтверждения отправлен.' });
  });
});


// Паролни ўзгартириш
router.post('/reset-password', async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  const [user] = await db.query('SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_expires > ?', 
                                [email, resetToken, Date.now()]);

  if (user.length === 0) {
    return res.status(400).json({ message: 'Проверочный код неверен или просрочен.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE email = ?', 
                 [hashedPassword, email]);

  res.json({ message: 'Пароль успешно изменен.' });
});


// Чиқиш
router.post('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка выхода' });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка удаления сессии' });
      }
      res.clearCookie('connect.sid', { path: '/' }); // Cookie'ni butunlay o‘chirish
      res.json({ message: 'Вы успешно вышли' });
    });
  });
});

module.exports = router;
