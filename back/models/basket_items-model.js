const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');

const BasketItem = sequelize.define('BasketItem', {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  timestamps: false,
  tableName: 'basket_items'
});

module.exports = { BasketItem };
