const express = require('express');
const DebtController = require('../controllers/debtController');
const router = express.Router();

// Барча қарзлар
router.get('/', DebtController.getAllDebts);
router.get('/:id', DebtController.getDebtorDetail);

// Дебитор маълумотлари учун алоҳида маршрутлар:
router.post('/debtor/:id', DebtController.addDebtorDetail);
router.put('/debtor/:id', DebtController.updateDebtorDetail);
//router.delete('/debtor/:id', DebtController.deleteDebtorDetail);

// Транзакциялар учун маршрутлар:
router.post('/:id/transactions', DebtController.addTransaction);
router.delete('/:id/transactions/:transactionId', DebtController.deleteTransaction);

// Қарзлар учун маршрутлар:
router.post('/', DebtController.addDebt);
router.put('/debt/:id', DebtController.updateDebt);
router.delete('/:id', DebtController.deleteDebt);

module.exports = router;
