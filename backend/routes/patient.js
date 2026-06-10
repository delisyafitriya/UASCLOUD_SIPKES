const express = require('express');
const router = express.Router();
const { pool, writeAuditLog } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.use(authenticateToken);
router.use(requireRole(['patient']));

router.post('/vitals', async (req, res) => {
    const { heart_rate, blood_pressure_sys, blood_pressure_dia, temperature, symptoms } = req.body;
    try {
        await pool.execute(
            'INSERT INTO health_records (patient_id, heart_rate, blood_pressure_sys, blood_pressure_dia, temperature, symptoms) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, heart_rate, blood_pressure_sys, blood_pressure_dia, temperature, symptoms]
        );
        await writeAuditLog(req.user.id, 'SUBMIT_VITALS', 'Submitted daily vitals');
        res.status(201).json({ success: true, message: 'Vitals saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save vitals' });
    }
});

router.get('/vitals', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM health_records WHERE patient_id = ? ORDER BY recorded_at DESC', [req.user.id]);
        res.json({ success: true, records: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch records' });
    }
});

router.post('/documents', upload.single('health_file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    try {
        const storage_url = `/uploads/${req.file.filename}`;
        await pool.execute(
            'INSERT INTO medical_documents (patient_id, document_name, storage_url) VALUES (?, ?, ?)',
            [req.user.id, req.file.originalname, storage_url]
        );
        await writeAuditLog(req.user.id, 'UPLOAD_DOCUMENT', `Uploaded ${req.file.originalname}`);
        res.json({ success: true, message: 'File uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save document' });
    }
});

router.get('/documents', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM medical_documents WHERE patient_id = ? ORDER BY uploaded_at DESC', [req.user.id]);
        res.json({ success: true, documents: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch documents' });
    }
});

module.exports = router;
