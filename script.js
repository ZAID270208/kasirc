let keranjangBelanja = [];

// Validasi input
function isValidNamaBarang(nama) {
    return /^[a-zA-Z\s]{2,30}$/.test(nama.trim());
}

function isValidHargaRupiah(harga) {
    const hargaNum = parseInt(harga);
    return !isNaN(hargaNum) && hargaNum >= 500 && hargaNum <= 10000000;
}

// Tambahkan fungsi closePopup
function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
        document.body.style.overflow = ''; // Kembalikan scroll
    }
}

// Perbaikan fungsi showPopup
function showPopup(title, content) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup" onclick="closePopup()">&times;</span>
            <h3>${title}</h3>
            ${content}
        </div>
    `;
    document.body.appendChild(popup);

    // Prevent scroll on background when popup is open
    document.body.style.overflow = 'hidden';
}

// Fungsi tambah barang dengan popup
function tambahBarang() {
    const formContent = `
        <form id="tambahBarangForm" style="margin-top: 15px;">
            <input type="text" id="namaBarang" placeholder="Nama Barang" 
                style="margin-bottom: 10px; padding: 12px; width: 100%; font-size: 16px;">
            <input type="number" id="hargaBarang" placeholder="Harga Barang" 
                style="margin-bottom: 10px; padding: 12px; width: 100%; font-size: 16px;">
            <input type="number" id="jumlahBarang" placeholder="Jumlah Barang" 
                style="margin-bottom: 10px; padding: 12px; width: 100%; font-size: 16px;">
            <button type="submit" 
                style="width: 100%; padding: 15px; font-size: 16px; margin-top: 10px;">
                Tambah ke Keranjang
            </button>
        </form>
    `;

    showPopup('Tambah Barang', formContent);

    // Tambahkan event listener untuk form
    const form = document.getElementById('tambahBarangForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('namaBarang').value;
        const harga = document.getElementById('hargaBarang').value;
        const jumlah = parseInt(document.getElementById('jumlahBarang').value);

        if (!isValidNamaBarang(nama)) {
            alert('Nama barang tidak valid! Gunakan 2-20 karakter huruf.');
            return;
        }

        if (!isValidHargaRupiah(harga)) {
            alert('Harga tidak valid! Masukkan harga antara Rp 500 - Rp 1.000.000');
            return;
        }

        const barangBaru = {
            nama: nama.trim(),
            harga: parseFloat(harga),
            jumlah: jumlah,
            total: parseFloat(harga) * jumlah
        };

        keranjangBelanja.push(barangBaru);
        lihatKeranjang();
        document.querySelector('.popup').remove();
    });
}

function lihatKeranjang() {
    const keranjangElement = document.getElementById('keranjang');
    if (keranjangBelanja.length === 0) {
        keranjangElement.innerHTML = "<p>Keranjang belanja kosong.</p>";
        return;
    }

    let html = `
        <h2>ISI KERANJANG:</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalKeseluruhan = 0;
    keranjangBelanja.forEach((barang, index) => {
        const total = barang.harga * barang.jumlah;
        totalKeseluruhan += total;
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${barang.nama}</td>
                <td>Rp ${barang.harga.toLocaleString()}</td>
                <td>${barang.jumlah}</td>
                <td>Rp ${total.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <p class="total">Total Keseluruhan: Rp ${totalKeseluruhan.toLocaleString()}</p>
    `;
    keranjangElement.innerHTML = html;
}

function hapusBarang() {
    if (keranjangBelanja.length === 0) {
        alert("Keranjang belanja kosong.");
        return;
    }

    const formContent = `
        <form id="hapusBarangForm">
            <input type="number" id="nomorBarang" placeholder="Nomor Barang" required min="1" max="${keranjangBelanja.length}">
            <button type="submit">Hapus Barang</button>
        </form>
    `;

    showPopup('Hapus Barang', formContent);

    document.getElementById('hapusBarangForm').onsubmit = (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('nomorBarang').value) - 1;
        keranjangBelanja.splice(index, 1);
        lihatKeranjang();
        document.querySelector('.popup').remove();
    };
}

function selesaiBelanja() {
    if (keranjangBelanja.length === 0) {
        showNotification('Keranjang belanja masih kosong!', 'error');
        return;
    }

    tampilkanStruk();
    
    // Tampilkan popup konfirmasi download PDF
    showPopup('Download Struk', `
        <div class="download-popup">
            <p>Terima kasih telah berbelanja!</p>
            <p>Apakah Anda ingin mengunduh struk belanja dalam format PDF?</p>
            <div class="popup-buttons">
                <button onclick="downloadPDF()" class="download-btn">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </button>
                <button onclick="closePopup()" class="cancel-btn">
                    Tutup
                </button>
            </div>
        </div>
    `);

    // Reset keranjang
    keranjangBelanja = [];
    showNotification('Transaksi selesai! Struk belanja siap diunduh.', 'success');
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka).replace('IDR', 'Rp');
}

function tampilkanStruk() {
    const strukElement = document.getElementById('struk');
    const strukBodyElement = document.getElementById('strukBody');
    const totalHargaElement = document.getElementById('totalHarga');
    
    let html = "";
    let totalKeseluruhan = 0;
    
    keranjangBelanja.forEach((barang, index) => {
        const totalBarang = barang.harga * barang.jumlah;
        totalKeseluruhan += totalBarang;
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${barang.nama}</td>
                <td>${formatRupiah(barang.harga)}</td>
                <td>${barang.jumlah}</td>
                <td>${formatRupiah(totalBarang)}</td>
            </tr>
        `;
    });
    
    strukBodyElement.innerHTML = html;
    totalHargaElement.innerHTML = `
        <div class="struk-total">
            <span>TOTAL HARGA:</span>
            <span class="total-amount">${formatRupiah(totalKeseluruhan)}</span>
        </div>
        <div class="struk-footer">
            <p>Terima kasih telah berbelanja!</p>
            <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
    `;
    
    strukElement.style.display = 'block';
    showNotification('Struk belanja telah dicetak!', 'success');
}

// Tambahkan fitur export ke PDF
function exportToPDF() {
    const strukContent = document.getElementById('struk').innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>Struk Belanja - Toko Zaid</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0;
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 12px; 
                        text-align: left;
                    }
                    th { 
                        background-color: #3498db; 
                        color: white; 
                    }
                    .total { 
                        font-weight: bold; 
                        text-align: right; 
                        margin-top: 20px;
                    }
                    .struk-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .struk-footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 0.9em;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="struk-header">
                    <h1>Toko Zaid</h1>
                    <p>Struk Belanja</p>
                    <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
                </div>
                ${strukContent}
                <div class="struk-footer">
                    <p>Terima kasih telah berbelanja di Toko Zaid!</p>
                    <p>Simpan struk ini sebagai bukti pembelian</p>
                </div>
            </body>
        </html>
    `);
    win.document.close();
    
    // Tampilkan notifikasi
    showNotification('Struk berhasil dicetak!', 'success');
    
    setTimeout(() => {
        win.print();
    }, 500);
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Tambahkan fitur pencarian barang
function tambahPencarianBarang() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Cari barang...';
    searchInput.className = 'search-input';
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.keranjang table tbody tr');
        
        rows.forEach(row => {
            const namaBarang = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            row.style.display = namaBarang.includes(searchTerm) ? '' : 'none';
        });
    });
    
    document.querySelector('.keranjang').prepend(searchInput);
}

// Perbaikan fungsi validasi
function isValidNamaBarang(nama) {
    return /^[a-zA-Z\s]{2,30}$/.test(nama.trim());
}

function isValidHargaRupiah(harga) {
    const hargaNum = parseInt(harga);
    return !isNaN(hargaNum) && hargaNum >= 500 && hargaNum <= 10000000;
}

// Pisahkan fungsi download PDF
function downloadPDF() {
    exportToPDF();
    closePopup(); // Tutup popup setelah download
}

// Tambahkan event listener untuk tombol-tombol
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tambahBarang').addEventListener('click', tambahBarang);
    document.getElementById('lihatKeranjang').addEventListener('click', lihatKeranjang);
    document.getElementById('hapusBarang').addEventListener('click', hapusBarang);
    document.getElementById('selesaiBelanja').addEventListener('click', selesaiBelanja);
});

console.log('Script loaded');
