const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql'); // Ton instance Sequelize

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  libelle: DataTypes.TEXT,
  description: DataTypes.TEXT,
  image: DataTypes.STRING,
  prix: DataTypes.FLOAT,
  categorie: DataTypes.STRING,
},{
  timestamps: false,
  tableName: 'products'
});

module.exports = { Product };
