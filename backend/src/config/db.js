const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'abs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true // Required to run the whole .sql file at once
});

/**
 * Automatically sets up the database schema if tables don't exist
 */
const initializeDatabase = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Locate your SQL file
        const sqlPath = "./src/config/setup_database.sql";
        
        // Read the SQL file content
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the entire script
        await connection.query(sql);
        
        console.log('✅ Database tables verified/created successfully.');
    } catch (err) {
        console.error('❌ Error during database initialization:', err.message);
    } finally {
        if (connection) connection.release();
    }
};

// Check connection and run initialization
pool.getConnection()
    .then(conn => {
        console.log('Connected to MySQL database');
        conn.release();
        // Run the table creation logic
        initializeDatabase();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = pool;