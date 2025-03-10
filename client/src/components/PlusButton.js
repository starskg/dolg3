import React, { useState, useEffect } from "react";
import plusButton from "../img/plus-button.svg";

const PlusButton = ({
  showMenu,
  setShowMenu,
  selectedType,
  setSelectedType,
  editingDebt,
}) => {
  const [animate, setAnimate] = useState(false);

  // Menyu ko'rsatilgan payt animatsiyani boshlash
  useEffect(() => {
    if (showMenu) {
      setTimeout(() => {
        setAnimate(true);
      }, 10);
    } else {
      setAnimate(false);
    }
  }, [showMenu]);

  // Agar type yoki editingDebt o'zgarsa, menyuni yopish
  useEffect(() => {
    if (selectedType || editingDebt) {
      setShowMenu(false);
    }
  }, [selectedType, editingDebt, setShowMenu]);

  return (
    <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
      {/* Asosiy "+" tugmasi */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn btn-primary rounded-circle"
        style={{
          width: "60px",
          height: "60px",
          border: "none",
          background: "none",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <img
          src={plusButton}
          alt="Plus button"
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            transform: `rotate(${showMenu ? 135 : 0}deg)`,
          }}
        />
      </button>

      {showMenu && (
        <>
          {/* Fon (chertilganda menyuni yopish) */}
          <div
            onClick={() => setShowMenu(false)}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1040, backgroundColor: "rgba(0,0,0,0.3)" }}
          />
          {/* "Дать долг" (tepa) */}
          <div
            className="position-absolute"
            style={{
              bottom: "80px",
              right: "0",
              zIndex: 1050,
              transform: animate
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.8)",
              opacity: animate ? 1 : 0,
              transition: "opacity 0.3s ease-out, transform 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-success"
              onClick={() => {
                setSelectedType("given");
                setShowMenu(false);
              }}
            >
              Дать долг
            </button>
          </div>

          {/* "Взять долг" (past) */}
          <div
            className="position-absolute"
            style={{
              bottom: "-40px",
              right: "0",
              zIndex: 1050,
              transform: animate
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.8)",
              opacity: animate ? 1 : 0,
              transition: "opacity 0.3s ease-out, transform 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-danger"
              onClick={() => {
                setSelectedType("taken");
                setShowMenu(false);
              }}
            >
              Взять долг
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlusButton;
