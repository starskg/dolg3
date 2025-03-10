import React from 'react';
import axios from 'axios';

const DebtItem = ({ debt, onDelete, onUpdate }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/debts/${debt.id}`, {
        withCredentials: true,
      });
      onDelete(debt.id); // Обновление списка
    } catch (error) {
      console.error('Ошибка при удалении долга:', error);
    }
  };

  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>{debt.debtor_name}</strong>: {debt.amount} ({debt.type}) - {debt.comment}{' '}
        ({debt.date})
      </div>
      <div>
        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>
          Удалить
        </button>
      </div>
    </li>
  );
};

export default DebtItem;
