const mysql = require('mysql2/promise');
require('dotenv').config();

const connectMYSQL = async () => {
  try {
    const db = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });
    console.log('Connected to MYSQL');
    return db;
  } catch (err) {
    console.error('Error : ',err);
    process.exit(1);
  }
};


module.exports = connectMYSQL;