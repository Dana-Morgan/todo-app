const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;

pool.connect()
    .then(() => console.log(" Connected to PostgreSQL!")).then (() =>   
          console.log(process.env.DB_PASSWORD)
)
    .catch(err => console.error(" Connection error:", err.message));
    console.log(process.env.DB_PASSWORD); // Ensure the password is correct

