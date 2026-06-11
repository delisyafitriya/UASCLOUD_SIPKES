const express = require('express');
const router = express.Router();
const { pool, writeAuditLog } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const { uploadToCloudinary } = require('../services/cloudinaryStorage');

// Menggunakan memoryStorage agar file dapat dikirim langsung ke Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

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

        res.status(201).json({
            success: true,
            message: 'Vitals saved successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to save vitals'
        });
    }
});

router.get('/vitals', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM health_records WHERE patient_id = ? ORDER BY recorded_at DESC',
            [req.user.id]
        );

        res.json({
            success: true,
            records: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch records'
        });
    }
});

router.post('/documents', upload.single('health_file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }

    try {
        // Upload file ke Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file);

        if (!cloudinaryResult) {
            return res.status(500).json({
                success: false,
                message: 'Cloudinary is not configured'
            });
        }

        const storage_url = cloudinaryResult.url;

        // Simpan URL Cloudinary ke database
        await pool.execute(
            'INSERT INTO medical_documents (patient_id, document_name, storage_url) VALUES (?, ?, ?)',
            [req.user.id, req.file.originalname, storage_url]
        );

        await writeAuditLog(
            req.user.id,
            'UPLOAD_DOCUMENT',
            `Uploaded ${req.file.originalname} to Cloudinary`
        );

        res.json({
            success: true,
            message: 'File uploaded successfully to Cloudinary',
            document_url: storage_url
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to upload document to Cloudinary'
        });
    }
});

router.get('/documents', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM medical_documents WHERE patient_id = ? ORDER BY uploaded_at DESC',
            [req.user.id]
        );

        res.json({
            success: true,
            documents: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch documents'
        });
    }
});

module.exports = router;