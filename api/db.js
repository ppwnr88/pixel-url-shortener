const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:"mariadb",
  user:"root",
  password:"root",
  database:"shortener",
  connectionLimit:10
});

module.exports = pool;