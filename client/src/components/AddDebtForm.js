import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddDebtForm.module.css";
import { AuthContext } from "../contexts/AuthContext";

// 1. Helper funksiyalar
const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getCurrentDateTime = () => formatDateForInput(new Date());

const AddDebtForm = ({ onAdd, onUpdate, defaultType, editingDebt, fetchDebts, onCancel }) => {
  // AuthContext dan isAuthenticated ni olish (hook har doim funksiya boshida chaqiriladi)
  const { isAuthenticated } = useContext(AuthContext);

  // 2. State hooklarini chaqirish (har doim, shartdan oldin)
  const [formData, setFormData] = useState({
    debtor_name: editingDebt ? editingDebt.debtor_name : "",
    amount: editingDebt ? editingDebt.amount : "",
    type: editingDebt ? editingDebt.type : (defaultType || "given"),
    comment: editingDebt ? editingDebt.comment : "",
    date: editingDebt ? formatDateForInput(editingDebt.date) : getCurrentDateTime(),
  });
  const [successMessage, setSuccessMessage] = useState("");

  // 3. useEffect hooki
  useEffect(() => {
    if (editingDebt) {
      setFormData({
        debtor_name: editingDebt.debtor_name,
        amount: editingDebt.amount,
        type: editingDebt.type,
        comment: editingDebt.comment,
        date: editingDebt.date ? formatDateForInput(editingDebt.date) : getCurrentDateTime(),
      });
    } else {
      setFormData({
        debtor_name: "",
        amount: "",
        type: defaultType || "given",
        comment: "",
        date: getCurrentDateTime(),
      });
    }
  }, [editingDebt, defaultType]);

  // 4. Event handlerlar
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const THRESHOLD = 1000000; // Masalan, 1,000,000 somdan katta bo'lsa

const handleSubmit = async (e) => {
  e.preventDefault();

  if (parseFloat(formData.amount) > THRESHOLD) {
    alert("Киритилган сумма жуда катта. Илтимос, суммани текшириб кўринг.");
    return; // Formani yuborishni to'xtatamiz
  }

  try {
    if (editingDebt) {
      await onUpdate({ ...formData, id: editingDebt.id });
    } else {
      const userResponse = await axios.get("http://localhost:5000/api/user", { withCredentials: true });
      const userId = userResponse.data.id;
      await axios.post(
        "http://localhost:5000/api/debts",
        { ...formData, user_id: userId },
        { withCredentials: true }
      );
      setSuccessMessage("Долг успешно добавлен!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    fetchDebts();
    onCancel(); // Forma yopilsin
  } catch (error) {
    console.error("❌ ERROR PROCESSING DEBT:", error);
  }
};

  

  const handleCancel = () => {
    setFormData({
      debtor_name: "",
      amount: "",
      type: defaultType || "given",
      comment: "",
      date: getCurrentDateTime(),
    });
    fetchDebts();
    
    onCancel();
  };

  // 5. Endi shartli render: agar foydalanuvchi autentifikatsiya qilinmagan bo'lsa, xabar qaytarish
  if (!isAuthenticated) {
    return <p>Пожалуйста, войдите в систему для добавления долга.</p>;
  }

  // 6. Forma render qilinishi
  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3>{formData.type === "given" ? "Дать в долг" : "Взять в долг"}</h3>
      <div>
        <label>Имя:</label>
        <input
          type="text"
          name="debtor_name"
          value={formData.debtor_name}
          onChange={handleChange}
          required
          className={styles.inputField}
        />
      </div>
      <div>
        <label>Сумма:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className={styles.inputField}
        />
      </div>
      <div>
        <label>Тип:</label>
        <select name="type" value={formData.type} onChange={handleChange} className={styles.inputField}>
          <option value="given">Я дал в долг</option>
          <option value="taken">Я взял в долг</option>
        </select>
      </div>
      <div>
        <label>Комментарий:</label>
        <textarea name="comment" value={formData.comment} onChange={handleChange} className={styles.inputField} />
      </div>
      <div>
        <label>Дата:</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={styles.inputField}
        />
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Отмена
        </button>
      </div>
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
    </form>
  );
};

export default AddDebtForm;
