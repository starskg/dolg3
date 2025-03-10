CREATE DATABASE IF NOT EXISTS my_debt_tracker;

USE my_debt_tracker;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    avatar_url VARCHAR(255)
);

CREATE TABLE debts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    debtor_name VARCHAR(255),
    amount DECIMAL(10, 2),
    type ENUM('given', 'taken'),
    comment TEXT,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);