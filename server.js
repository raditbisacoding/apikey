const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware untuk membaca data dari form/JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database tiruan dalam memori (Akan tereset jika server mati)
// Di dunia nyata, Anda harus menggunakan MongoDB atau MySQL
const usersDatabase = [];

// Fungsi untuk membuat API Key acak (Contoh: nanzz_8f2a1b...)
function generateApiKey() {
    return 'key_' + crypto.randomBytes(8).toString('hex');
}

// ROUTE HALAMAN UTAMA (Landing Page / Login & Register)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ROUTE PROSES REGISTER & LOGIN (Sederhana)
app.post('/auth', (req, res) => {
    const { username, password, action } = req.body;

    if (action === 'register') {
        // Cek apakah user sudah ada
        const userExists = usersDatabase.find(u => u.username === username);
        if (userExists) return res.send('Username sudah terdaftar! <a href="/">Kembali</a>');

        // Buat user baru dengan limit default 50
        const newUser = {
            username,
            password,
            apikey: generateApiKey(),
            limit: 50
        };
        usersDatabase.push(newUser);
        return res.send(`Registrasi berhasil! API Key Anda: <b>${newUser.apikey}</b>. <a href="/">Login sekarang</a>`);
    } 
    
    if (action === 'login') {
        const user = usersDatabase.find(u => u.username === username && u.password === password);
        if (!user) return res.send('Username atau password salah! <a href="/">Kembali</a>');

        // Alihkan ke dashboard dengan membawa username lewat query parameter (simulasi session)
        return res.redirect(`/dashboard?username=${user.username}`);
    }
});

// ROUTE DASHBOARD USER
app.get('/dashboard', (req, res) => {
    const { username } = req.query;
    const user = usersDatabase.find(u => u.username === username);
    
    if (!user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// API ENDPOINT UNTUK MENGAMBIL DATA USER (Dipanggil oleh Dashboard lewat AJAX/Fetch)
app.get('/api/user-stats', (req, res) => {
    const { username } = req.query;
    const user = usersDatabase.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    
    res.json({
        username: user.username,
        apikey: user.apikey,
        limit: user.limit
    });
});

// ==========================================
// JANTUNG API: MIDDLEWARE PENGECEKAN API KEY
// ==========================================
const verifyApiKey = (req, res, next) => {
    const { apikey } = req.query;

    if (!apikey) {
        return res.status(401).json({ status: false, message: 'Masukkan parameter ?apikey= API_KEY_ANDA' });
    }

    const user = usersDatabase.find(u => u.apikey === apikey);

    if (!user) {
        return res.status(403).json({ status: false, message: 'API Key tidak valid!' });
    }

    if (user.limit <= 0) {
        return res.status(429).json({ status: false, message: 'Limit API Key Anda hari ini telah habis!' });
    }

    // Kurangi limit user sebanyak 1 setiap kali sukses request
    user.limit -= 1;
    next();
};

// ==========================================
// CONTH FITUR API YANG DISEDIAKAN
// ==========================================
app.get('/api/fitur/cuaca', verifyApiKey, (req, res) => {
    const kota = req.query.kota || 'Jakarta';
    
    // Ini contoh response statis. Di dunia nyata Anda bisa melakukan scraping 
    // atau menembak ke API cuaca pihak ketiga.
    res.json({
        status: true,
        creator: "Admin-API",
        result: {
            kota: kota,
            suhu: "29°C",
            kondisi: "Cerah Berawan",
            saran: "Cocok untuk jalan-jalan sore."
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
