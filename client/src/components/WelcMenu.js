import React from "react";
import PlusButton from "./PlusButton";
import "../styles/WelcMenu.css";

function WelcMenu({
  user,
  totalAmount,
  showMenu,
  setShowMenu,
  setSelectedType,
  myDebtsAmount,
  givenDebtsAmount,
}) {
  return (
    <div className="welcMenu-wrapper">
      <div className="welcMenu-row">
        {/* Salomlashish blok */}
        <div className="block greeting-container">
          <h3>{user ? `Привет, ${user.name}!` : "Загрузка..."}</h3>
          <p>Добро пожаловать в систему учёта долгов</p>
        </div>

 {/* “Мен берган карзлар” blok (Я дал) */}
 <div className="block debts-info">
          <span className="info-label">Мне должны:</span>
          <span className="info-value">
            {givenDebtsAmount.toLocaleString()}
            <span className="currency"> сом</span>
          </span>
        </div>

        {/* “Барча карзларим” blok (Я должен) */}
        <div className="block debts-info">
          <span className="info-label">Все мои долги:</span>
          <span className="info-value2">
            -{myDebtsAmount.toLocaleString()}
            <span className="currency"> сом</span>
          </span>
        </div>

       
        {/* Umumiy summa blok */}
<div className="block sum-container">
          <span className="sum-label">Итоговый расчёт:</span>
          <span
            className="sum-value"
            style={{
              color: totalAmount >= 0 ? "#0d6efd" : "#dc3545",
            }}
          >
            ={totalAmount.toLocaleString()}
            <span className="currency"> сом</span>
          </span>
        </div>

        {/* Plus tugmasi blok */}
        <div className="block">
          <PlusButton
            setShowMenu={setShowMenu}
            showMenu={showMenu}
            setSelectedType={setSelectedType}
          />
        </div>
      </div>
    </div>
  );
}

export default WelcMenu;