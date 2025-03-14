function ensureAdmin(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'Доступ запрещен. Админ эмас.' });
    }
  }
  
  module.exports = { ensureAdmin };