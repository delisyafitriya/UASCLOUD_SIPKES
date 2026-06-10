const express = require('express');
const router = express.Router();
const { pool, writeAuditLog } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireRole(['doctor']));

router.get('/patients', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE role = "patient" AND status = "active"');
        res.json({ success: true, patients: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch patients' });
    }
});

router.get('/patient/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [patient] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [id]);
        if (patient.length === 0) return res.status(404).json({ success: false, message: 'Patient not found' });

        const [records] = await pool.execute('SELECT * FROM health_records WHERE patient_id = ? ORDER BY recorded_at DESC', [id]);
        const [documents] = await pool.execute('SELECT * FROM medical_documents WHERE patient_id = ? ORDER BY uploaded_at DESC', [id]);

        res.json({ success: true, patient: patient[0], records, documents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch patient data' });
    }
});

router.post('/record/:recordId/notes', async (req, res) => {
    const { recordId } = req.params;
    const { notes } = req.body;
    try {
        await pool.execute('UPDATE health_records SET notes = ? WHERE id = ?', [notes, recordId]);
        await writeAuditLog(req.user.id, 'ADD_NOTES', `Added clinical notes to record ${recordId}`);
        res.json({ success: true, message: 'Notes added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add notes' });
    }
});

module.exports = router;
