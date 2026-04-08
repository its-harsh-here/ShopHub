const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL
});

module.exports = pool;
