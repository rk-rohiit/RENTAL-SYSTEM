const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,     // Correct server name
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '1433'),

  options: {
    encrypt: false,                // Disable for local SQL Server
    trustServerCertificate: true   // REQUIRED for local machines
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server ✔');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed!');
    console.error('Error:', err);
    throw err;
  });

module.exports = { sql, poolPromise };
