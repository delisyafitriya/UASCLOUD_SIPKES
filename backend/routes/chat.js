const express = require('express');
const router = express.Router();
const axios = require('axios');
const { pool, writeAuditLog } = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireRole(['patient']));

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT sender, message, created_at FROM chat_histories WHERE patient_id = ? ORDER BY created_at ASC', [req.user.id]);
        res.json({ success: true, history: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch chat history' });
    }
});

router.post('/', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message cannot be empty' });

    try {
        // Save user message
        await pool.execute('INSERT INTO chat_histories (patient_id, sender, message) VALUES (?, "patient", ?)', [req.user.id, message]);

        let aiAnalysis = 'Maaf, saya tidak dapat merespons saat ini.';
        const hfToken = process.env.HF_TOKEN;

        if (hfToken) {
            try {
                const hfResponse = await axios.post(
                    'https://router.huggingface.co/v1/chat/completions',
                    {
                        model: "Qwen/Qwen2.5-7B-Instruct",
                        messages: [
                            { role: "system", content: "Anda adalah asisten kesehatan AI yang ramah. Berikan saran kesehatan ringkas untuk pengguna. Di akhir kalimat, selalu tambahkan 'Disclaimer: Ini bukan nasihat medis resmi, harap periksa ke dokter Anda.'" },
                            { role: "user", content: message }
                        ],
                        max_tokens: 500
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${hfToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (hfResponse.data && hfResponse.data.choices && hfResponse.data.choices.length > 0) {
                    aiAnalysis = hfResponse.data.choices[0].message.content.trim();
                } else if (hfResponse.data && hfResponse.data.error) {
                    console.error('HF API Error:', hfResponse.data.error);
                }
            } catch (hfError) {
                console.error('Hugging Face API Error:', hfError.response?.data || hfError.message);
                if (hfError.response && hfError.response.status === 503) {
                    aiAnalysis = 'Model AI sedang loading, silakan coba lagi beberapa saat.';
                }
            }
        }

        // Save AI response
        await pool.execute('INSERT INTO chat_histories (patient_id, sender, message) VALUES (?, "ai", ?)', [req.user.id, aiAnalysis]);
        
        res.json({ success: true, ai_response: aiAnalysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to process chat' });
    }
});

module.exports = router;
