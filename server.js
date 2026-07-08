const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// Database Sementara (Gunakan MongoDB di dunia nyata agar data tidak hilang saat restart)
global.usersDatabase = [
    { username: "admin", password: "123", apikey: "key_premium_radit", limit: 99999, status: "Premium" }
];

// Import Rute Tambahan
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

app.use('/auth', authRouter);
app.use('/api', apiRouter);

// Halaman utama & Dashboard
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
