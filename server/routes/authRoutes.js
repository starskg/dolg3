const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Google OAuth маршрутлари (мавжуд)
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000', successRedirect: 'http://localhost:3000/dashboard' }));

// Facebook OAuth маршрутлари (янги)
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000', successRedirect: 'http://localhost:3000/dashboard' }));

// Фойдаланувчи маълумотлари
router.get('/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Фойдаланувчи тасдиқланмаган' });
  }
  res.json(req.user);
});

// Рўйхатдан ўтиш маршрути
router.post('/register', async (req, res) => {
  try {
    console.log("Сўров келди:", req.body); // Фойдаланувчи юборган маълумотни чиқарамиз

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Барча майдонларни тўлдиринг' });
    }

    // Фойдаланувчи мавжуд ёки йўқлигини текшириш
    console.log("MySQL сўров юборилмоқда...");
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      console.log("Фойдаланувчи аллақачон мавжуд!");
      return res.status(400).json({ message: 'Бундай email аллақачон мавжуд' });
    }

    // Паролни хэш қилиш
    console.log("Парол хэшланмоқда...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("MySQL'га янги фойдаланувчи қўшилмоқда...");
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log("Янги фойдаланувчи қўшилди:", result);

    const newUser = {
      id: result.insertId,
      name,
      email,
    };

    console.log("Фойдаланувчи автоматик логин қилиняпти...");
    req.login(newUser, (err) => {
      if (err) {
        console.error("Логинда хатолик:", err);
        return res.status(500).json({ message: 'Логин жараёнида хатолик' });
      }
      res.json({ message: 'Рўйхатдан ўтиш муваффақиятли', user: newUser });
    });

  } catch (err) {
    console.error("Серверда хатолик:", err);
    res.status(500).json({ message: 'Сервер хатоси' });
  }
});



router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Вход успешный' });
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
