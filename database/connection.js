const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  port: process.env.PORTDB,
});

module.exports = {connection};