// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/auth');
const AdminController = require('../controllers/adminController');

router.get('/pages', ensureAdmin, AdminController.getPages);
router.post('/pages', ensureAdmin, AdminController.createPage);
router.put('/pages/:id', ensureAdmin, AdminController.updatePage);
router.delete('/pages/:id', ensureAdmin, AdminController.deletePage);

router.get('/users', ensureAdmin, AdminController.getUsers);
router.put('/users/:id', ensureAdmin, AdminController.updateUser);

module.exports = router;
