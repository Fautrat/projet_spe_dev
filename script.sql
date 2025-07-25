CREATE DATABASE spe_dev;
USE spe_dev;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    imagePath VARCHAR(255),
    prix DECIMAL(10, 2) NOT NULL,
    categorie VARCHAR(255) NOT NULL
);

create table users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);


INSERT INTO products (libelle, description, imagePath, prix, categorie) VALUES
('Chapeau', 'Un chapeau que personne ne peut voir', NULL, 99.99, 'Magie'),
('Poulet', 'Some fried chicken', NULL, 9.9, 'nourriture'),
('Cravate', 'Parfaite pour les soirées', NULL, 50.50, 'Mode');