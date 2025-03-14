// src/components/PageList.js
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const PageList = ({ pages, onPageUpdated, onPageDeleted }) => {
  return (
    <ul>
      {pages.length === 0 ? (
        <p>Саҳифалар мавжуд эмас.</p>
      ) : (
        pages.map((page) => (
          <li
            key={page.id}
            style={{
              marginBottom: "10px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            <strong>{page.title}</strong> — {page.link}
            <div style={{ marginTop: "5px" }}>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onPageUpdated(page)}
              >
                Редактировать
              </Button>{" "}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onPageDeleted(page.id)}
              >
                Удалить
              </Button>{" "}
              {/* Добавляем кнопку "Открыть" */}
              <Link to={`/page/${page.link}`}>
                <Button variant="outline-success" size="sm">
                  Открыть
                </Button>
              </Link>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default PageList;
