const express = require('express');
const router = express.Router();

// Middleware: Proteksi & Pengurangan Limit API Key
router.use((req, res, next) => {
    const { apikey } = req.query;
    if (!apikey) return res.status(401).json({ status: false, creator: "NanzzAPI", message: "Masukkan parameter ?apikey=" });

    const user = global.usersDatabase.find(u => u.apikey === apikey);
    if (!user) return res.status(403).json({ status: false, creator: "NanzzAPI", message: "API Key salah atau kadaluwarsa!" });

    if (user.limit <= 0) return res.status(429).json({ status: false, creator: "NanzzAPI", message: "Limit harian Anda habis!" });

    if (user.status !== "Premium") user.limit -= 1; // User premium tidak berkurang limitnya
    next();
});

/* ==========================================
   1. KATEGORI: DOWNLOADER ENDPOINTS
   ========================================== */
router.get('/download/tiktok', (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: "Masukkan parameter ?url=" });
    res.json({
        status: true, creator: "NanzzAPI",
        result: { title: "Tiktok Video Trend", video_url: "https://server.com/cdn/vid1.mp4", audio_url: "https://server.com/cdn/aud1.mp3" }
    });
});

router.get('/download/youtube', (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: "Masukkan parameter ?url=" });
    res.json({
        status: true, creator: "NanzzAPI",
        result: { title: "Tutorial Menjadi Developer", quality: "720p", download_url: "https://server.com/cdn/yt.mp4" }
    });
});

/* ==========================================
   2. KATEGORI: ARTIFICIAL INTELLIGENCE (AI)
   ========================================== */
router.get('/ai/chatgpt', (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: "Masukkan parameter ?text=" });
    res.json({
        status: true, creator: "NanzzAPI",
        result: `Ini adalah jawaban AI otomatis untuk pertanyaan Anda yang berbunyi: "${text}"`
    });
});

router.get('/ai/bard', (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: "Masukkan parameter ?text=" });
    res.json({ status: true, creator: "NanzzAPI", result: "Google Bard Response: Halo! Ada yang bisa dibantu?" });
});

/* ==========================================
   3. KATEGORI: TOOLS & ANIME
   ========================================== */
router.get('/tools/ssweb', (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: "Masukkan parameter ?url=" });
    res.json({ status: true, creator: "NanzzAPI", result: { image_screenshot: `https://image.thum.io/get/${url}` } });
});

router.get('/anime/waifu', (req, res) => {
    res.json({ status: true, creator: "NanzzAPI", result: { name: "Megumin", image: "https://pic.files/megumin.jpg" } });
});

module.exports = router;
