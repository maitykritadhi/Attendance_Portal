const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kritadhi*123",
  database: "attenendance",
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true
});

module.exports = pool;
