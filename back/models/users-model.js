const { DataTypes } = require('sequelize');
const sequelize = require('../config/mysql'); // Ton instance Sequelize

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

module.exports = { User };