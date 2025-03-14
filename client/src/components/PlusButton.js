import React, { useState, useEffect } from "react";
import plusButtonImg from "../img/plus-button.svg"; // + tugmasi uchun rasm


const PlusButton = ({ showMenu, setShowMenu, selectedType, setSelectedType, editingDebt }) => {
  const [animate, setAnimate] = useState(false);

  // Menyu ochilganda animatsiyani ishga tushiramiz
  useEffect(() => {
    if (showMenu) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [showMenu]);

  // Agar selectedType yoki editingDebt o'zgarsa, menyuni yopish
  useEffect(() => {
    if (selectedType || editingDebt) {
      setShowMenu(false);
    }
  }, [selectedType, editingDebt, setShowMenu]);

  const buttonStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    padding: 0,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    transform: `rotate(${showMenu ? 135 : 0}deg)`,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1040,
    backgroundColor: 'rgba(0,0,0,0.3)',
  };

  // Chap tomonda chiqadigan tugma (Дать долг)
  const leftButtonStyle = {
    position: 'absolute',
    left: '-130px',
    top: '50%',
    transform: animate
      ? "translateY(-50%) translateX(0) scale(1)"
      : "translateY(-50%) translateX(-20px) scale(0.8)",
    opacity: animate ? 1 : 0,
    transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
    zIndex: 1050,
  };

  // O'ng tomonda chiqadigan tugma (Взять долг)
  const rightButtonStyle = {
    position: 'absolute',
    right: '-130px',
    top: '50%',
    transform: animate
      ? "translateY(-50%) translateX(0) scale(1)"
      : "translateY(-50%) translateX(20px) scale(0.8)",
    opacity: animate ? 1 : 0,
    transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
    zIndex: 1050,
  };

  const smallButtonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setShowMenu(!showMenu)} style={buttonStyle}>
        <img src={plusButtonImg} alt="Plus button" style={imageStyle} />
      </button>
      {showMenu && (
        <>
          <div onClick={() => setShowMenu(false)} style={overlayStyle} />
          <div style={leftButtonStyle} onClick={(e) => e.stopPropagation()}>
            <button
              style={{ ...smallButtonStyle, backgroundColor: '#28a745', color: '#fff' }}
              onClick={() => {
                setSelectedType("given");
                setShowMenu(false);
              }}
            >
              Дать долг
            </button>
          </div>
          <div style={rightButtonStyle} onClick={(e) => e.stopPropagation()}>
            <button
              style={{ ...smallButtonStyle, backgroundColor: '#dc3545', color: '#fff' }}
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
