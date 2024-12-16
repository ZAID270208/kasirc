const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/game3.html');
});

// API Endpoints
app.post('/api/keranjang', (req, res) => {
    try {
        const { action, data } = req.body;
        let response = {};

        switch(action) {
            case 'tambah':
                // Logika untuk menambah barang
                response = { success: true, message: 'Barang berhasil ditambahkan' };
                break;
            case 'lihat':
                // Logika untuk melihat keranjang
                response = { success: true, data: keranjangBelanja };
                break;
            case 'hapus':
                // Logika untuk menghapus barang
                response = { success: true, message: 'Barang berhasil dihapus' };
                break;
            default:
                throw new Error('Action tidak valid');
        }

        res.json(response);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});

// Start server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
