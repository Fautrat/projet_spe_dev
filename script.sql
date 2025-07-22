CREATE DATABASE spe_dev;
USE spe_dev;

CREATE TABLE products (
    identifiant INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    images VARCHAR(255),
    prix DECIMAL(10, 2) NOT NULL,
    categorie VARCHAR(255) NOT NULL
);

  identifiant: DataTypes.INTEGER,
  libelle: DataTypes.TEXT,
  description: DataTypes.TEXT,
  images: DataTypes.STRING,
  prix: DataTypes.FLOAT,
  categorie: DataTypes.STRING,