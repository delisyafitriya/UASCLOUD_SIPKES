const express = require('express');
const router = express.Router();
const { pool, writeAuditLog } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/metrics', async (req, res) => {
    try {
        const [[{ total_patients }]] = await pool.execute('SELECT COUNT(*) as total_patients FROM users WHERE role = "patient"');
        const [[{ active_doctors }]] = await pool.execute('SELECT COUNT(*) as active_doctors FROM users WHERE role = "doctor" AND status = "active"');
        const [[{ total_documents }]] = await pool.execute('SELECT COUNT(*) as total_documents FROM medical_documents');
        
        // Count AI requests today
        const [[{ ai_requests_today }]] = await pool.execute(
            'SELECT COUNT(*) as ai_requests_today FROM chat_histories WHERE sender = "ai" AND DATE(created_at) = CURDATE()'
        );

        res.json({
            success: true,
            metrics: { total_patients, active_doctors, total_documents, ai_requests_today }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
    }
});

router.get('/doctors', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, email, status, created_at FROM users WHERE role = "doctor"');
        res.json({ success: true, doctors: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
    }
});

router.post('/doctors/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('UPDATE users SET status = "active" WHERE id = ? AND role = "doctor"', [id]);
        await writeAuditLog(req.user.id, 'APPROVE_DOCTOR', `Approved doctor ID ${id}`);
        res.json({ success: true, message: 'Doctor approved' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to approve doctor' });
    }
});

router.post('/doctors/:id/suspend', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('UPDATE users SET status = "pending" WHERE id = ? AND role = "doctor"', [id]);
        await writeAuditLog(req.user.id, 'SUSPEND_DOCTOR', `Suspended doctor ID ${id}`);
        res.json({ success: true, message: 'Doctor suspended' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to suspend doctor' });
    }
});

router.get('/audit-logs', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT a.*, u.name as user_name, u.role as user_role 
            FROM audit_logs a 
            LEFT JOIN users u ON a.user_id = u.id 
            ORDER BY timestamp DESC LIMIT 100
        `);
        res.json({ success: true, logs: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    }
});

// CRUD for Doctors
router.post('/doctors', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });
        
        await pool.execute('INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, "doctor", "active")', [name, email, password]);
        await writeAuditLog(req.user.id, 'CREATE_DOCTOR', `Created doctor ${email}`);
        res.json({ success: true, message: 'Doctor created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create doctor' });
    }
});

router.put('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        if (password) {
            await pool.execute('UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ? AND role = "doctor"', [name, email, password, id]);
        } else {
            await pool.execute('UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "doctor"', [name, email, id]);
        }
        await writeAuditLog(req.user.id, 'UPDATE_DOCTOR', `Updated doctor ID ${id}`);
        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update doctor' });
    }
});

router.delete('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM users WHERE id = ? AND role = "doctor"', [id]);
        await writeAuditLog(req.user.id, 'DELETE_DOCTOR', `Deleted doctor ID ${id}`);
        res.json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete doctor' });
    }
});

// CRUD for Patients
router.get('/patients', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, email, status, created_at FROM users WHERE role = "patient"');
        res.json({ success: true, patients: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch patients' });
    }
});

router.post('/patients', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });
        
        await pool.execute('INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, "patient", "active")', [name, email, password]);
        await writeAuditLog(req.user.id, 'CREATE_PATIENT', `Created patient ${email}`);
        res.json({ success: true, message: 'Patient created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create patient' });
    }
});

router.put('/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        if (password) {
            await pool.execute('UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ? AND role = "patient"', [name, email, password, id]);
        } else {
            await pool.execute('UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "patient"', [name, email, id]);
        }
        await writeAuditLog(req.user.id, 'UPDATE_PATIENT', `Updated patient ID ${id}`);
        res.json({ success: true, message: 'Patient updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update patient' });
    }
});

router.delete('/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM users WHERE id = ? AND role = "patient"', [id]);
        await writeAuditLog(req.user.id, 'DELETE_PATIENT', `Deleted patient ID ${id}`);
        res.json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete patient' });
    }
});

module.exports = router;
