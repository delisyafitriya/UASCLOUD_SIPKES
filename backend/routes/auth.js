const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool, writeAuditLog } = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const assignedRole = ['patient', 'doctor'].includes(role) ? role : 'patient';
        const status = assignedRole === 'doctor' ? 'pending' : 'active';

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, assignedRole, status]
        );
        
        await writeAuditLog(result.insertId, 'REGISTER', `Registered as ${assignedRole} (${status})`);
        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Registration failed. Email might already exist.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND password_hash = ?', [email, password]);
        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role, status: user.status },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            await writeAuditLog(user.id, 'LOGIN_SUCCESS', 'User logged in');
            res.json({
                success: true,
                token,
                user: { id: user.id, name: user.name, role: user.role, status: user.status }
            });
        } else {
            await writeAuditLog(null, 'LOGIN_FAILED', `Failed login attempt for email: ${email}`);
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Login error' });
    }
});

module.exports = router;
