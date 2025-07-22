const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ton instance Sequelize

const Product = sequelize.define('Product', {
  identifiant: DataTypes.INTEGER,
  libelle: DataTypes.TEXT,
  description: DataTypes.TEXT,
  images: DataTypes.STRING,
  prix: DataTypes.FLOAT,
  categorie: DataTypes.STRING,
});

module.exports = { Product };
