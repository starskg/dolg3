const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);
router.get('/user', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Фойдаланувчи тасдиқланмаган' });
    }
    res.json(req.user); // Фойдаланувчи маълумотларини жавоб сифатида юборамиз
  });

  // Logout qilish
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