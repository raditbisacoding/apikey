const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ status: false, message: "Isi semua form!" });

    const exists = global.usersDatabase.find(u => u.username === username);
    if (exists) return res.json({ status: false, message: "Username sudah terdaftar!" });

    const newUser = {
        username,
        password,
        apikey: 'nanzz_' + crypto.randomBytes(6).toString('hex'),
        limit: 50,
        status: "Free"
    };
    global.usersDatabase.push(newUser);
    res.json({ status: true, message: "Registrasi sukses!", apikey: newUser.apikey });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = global.usersDatabase.find(u => u.username === username && u.password === password);
    
    if (!user) return res.json({ status: false, message: "Username atau password salah!" });
    res.json({ status: true, message: "Login berhasil!", username: user.username });
});

router.get('/profile', (req, res) => {
    const { username } = req.query;
    const user = global.usersDatabase.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ username: user.username, apikey: user.apikey, limit: user.limit, status: user.status });
});

module.exports = router;
