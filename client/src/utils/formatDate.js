// client/src/utils/formatDate.js

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthNames = [
      'Январь', // Январь
      'Февраль', // Февраль
      'Март', // Март
      'Апрель', // Апрель
      'Май', // Май
      'Июнь', // Июнь
      'Июль', // Июль
      'Август', // Август
      'Сентябрь', // Сентябрь
      'Октябрь', // Октябрь
      'Ноябрь', // Ноябрь
      'Декабрь', // Декабрь
    ];
    const month = monthNames[date.getMonth()]; // Ойни кискартирилган шаклида олиш
    const day = String(date.getDate()).padStart(2, '0'); // Кунни 2 хонали килиш
  
    // Формат: 2025г.17фев
    return `${day} ${month} ${year}г.`;
  };
  