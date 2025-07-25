const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql');
const { Basket } = require('./basket-model');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  timestamps: false,
  tableName: 'users'
});

User.afterCreate(async (user) => {
  await Basket.create({ userId: user.id });
});

module.exports = { User };