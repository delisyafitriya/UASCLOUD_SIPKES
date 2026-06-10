const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'oop',
    database: process.env.DB_NAME || 'health_db'
};

const pool = mysql.createPool(dbConfig);

async function writeAuditLog(userId, action, description) {
    try {
        await pool.execute(
            'INSERT INTO audit_logs (user_id, action, description) VALUES (?, ?, ?)',
            [userId || null, action, description]
        );
    } catch (error) {
        console.error('Failed to log audit:', error);
    }
}

module.exports = { pool, writeAuditLog };
