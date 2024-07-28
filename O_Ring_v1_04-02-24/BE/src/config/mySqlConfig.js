const mysql = require('mysql2');

const mysqlConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ganesh@007',
    database: 'o-ring',
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
  });
  
  module.exports = mysqlConnection;