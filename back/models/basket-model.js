const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');

const Basket = sequelize.define('Basket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, {
  timestamps: false,
  tableName: 'baskets'
});

module.exports = { Basket };
