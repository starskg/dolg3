import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate'; // formatDate funksiyasi sana formatini qayta ishlaydi
import { FaEdit, FaTrash, FaPlus, FaMinus, FaUser } from 'react-icons/fa';
import { Table, Button } from 'react-bootstrap';


const formatLocalDate = (dateInput) => {
  const d = new Date(dateInput);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD formatida
};

const DebtList = ({ debts, onDelete, onUpdate, onRowClick }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedDebt, setEditedDebt] = useState({});
  const [transactions, setTransactions] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");

  const handleEdit = (debt) => {
    setEditingId(debt.id);
    setEditedDebt({
      debtor_name: debt.debtor_name,
      amount: debt.amount,
      date: formatLocalDate(debt.date),
      comment: debt.comment || "",
    });
  };

  const handleSave = async () => {
    try {
      await onUpdate({ ...editedDebt, id: editingId });
      setEditingId(null);
      setUpdateMessage("Долг успешно отредактирован!");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      setUpdateMessage("Ошибка при обновлении: " + (error.response?.data?.message || error.message));
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleTransaction = async (debt, txType) => {
    const input = window.prompt(txType === 'plus' ? "Введите сумму для добавления:" : "Введите сумму для вычитания:");
    if (!input) return;
    const amountChange = parseFloat(input);
    if (isNaN(amountChange)) {
      alert("Неверная сумма");
      return;
    }

    const newAmount = txType === 'plus'
      ? parseFloat(debt.amount) + amountChange
      : parseFloat(debt.amount) - amountChange;

    const updatedDebt = { ...debt, amount: newAmount.toFixed(2) };
    try {
      await onUpdate({ ...updatedDebt, id: debt.id });
      const newTx = { type: txType, amount: amountChange, date: new Date().toLocaleString() };
      setTransactions((prev) => ({
        ...prev,
        [debt.id]: prev[debt.id] ? [...prev[debt.id], newTx] : [newTx],
      }));
    } catch (error) {
      console.error("Ошибка при проведении транзакции:", error);
    }
  };

  return (
    <div>
      {updateMessage && <div className="alert alert-info">{updateMessage}</div>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Комментарий</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {debts.map((debt) => (
            <React.Fragment key={debt.id}>
              <tr onClick={() => onRowClick(debt)} style={{ cursor: 'pointer' }}>
                {editingId === debt.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editedDebt.debtor_name}
                        onChange={(e) => setEditedDebt({ ...editedDebt, debtor_name: e.target.value })}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editedDebt.amount}
                        onChange={(e) => setEditedDebt({ ...editedDebt, amount: e.target.value })}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editedDebt.date}
                        onChange={(e) => setEditedDebt({ ...editedDebt, date: e.target.value })}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editedDebt.comment}
                        onChange={(e) => setEditedDebt({ ...editedDebt, comment: e.target.value })}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <Button variant="success" size="sm" onClick={handleSave}>
                        Сохранить
                      </Button>
                      <Button variant="secondary" size="sm" className="ms-2" onClick={handleCancel}>
                        Отмена
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <FaUser className="me-2" />
                      {debt.debtor_name}
                    </td>

                    <td>{debt.amount} сом</td>
                    <td>{formatDate(debt.date)}</td>
                    <td>{debt.comment}</td>
                    <td>

                      <Button variant="outline-danger" size="sm" className="me-2" onClick={(e) => { e.stopPropagation(); onDelete(debt.id); }}>
                            <i className="bi bi-trash"></i>
                      </Button>



                    </td>
                  </>
                )}
              </tr>
              {transactions[debt.id] && transactions[debt.id].length > 0 && (
                <tr>
                  <td colSpan="5">
                    <ul className="list-unstyled mb-0">
                      {transactions[debt.id].map((tx, index) => (
                        <li key={index} className="text-muted">
                          {tx.date}: {tx.type === 'plus' ? '+' : '-'} {tx.amount} сом
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DebtList;
