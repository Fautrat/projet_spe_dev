const { Sequelize } = require('sequelize');
require('dotenv').config();

const connectMYSQL = async () => {
  try {
    const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql'
    });
    await sequelize.authenticate();
    console.log('Connected to MYSQL');
    return sequelize;
  } catch (err) {
    console.error('Error : ',err);
    process.exit(1);
  }
}

module.exports = connectMYSQL;