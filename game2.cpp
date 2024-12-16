#include <iostream>
#include <vector>
#include <iomanip>
#include <algorithm>
#include <limits>
#include <regex>
#include <sstream>
using namespace std;

struct Barang {
    string nama;
    int harga;
    int jumlah;
};

vector<Barang> keranjangBelanja;

bool bandingkanBarang(const Barang& barang1, const Barang& barang2) {
    return barang1.nama < barang2.nama;
}

bool isValidNamaBarang(const string& nama) {
    regex pattern("^[a-zA-Z][a-zA-Z ]{1,19}$");
    return regex_match(nama, pattern);
}

bool isValidHargaRupiah(int harga) {
    const vector<int> validPrices = {500, 1000, 2000, 5000, 10000, 20000, 50000, 100000};
    return find(validPrices.begin(), validPrices.end(), harga) != validPrices.end();
}

string formatHarga(int harga) {
    stringstream ss;
    ss << "Rp " << setfill('0') << setw(6) << harga;
    string hargaStr = ss.str();
    int len = hargaStr.length();
    if (len > 6) {
        hargaStr.insert(len - 3, ".");
    }
    if (len > 9) {
        hargaStr.insert(len - 6, ".");
    }
    return hargaStr;
}

void tambahKeKeranjang(const string& nama, int harga, int jumlah) {
    if (!isValidNamaBarang(nama)) {
        cout << "Nama barang tidak valid!\n";
        return;
    }
    if (!isValidHargaRupiah(harga)) {
        cout << "Harga tidak valid!\n";
        return;
    }
    if (jumlah < 1) {
        cout << "Jumlah tidak valid!\n";
        return;
    }

    auto it = find_if(keranjangBelanja.begin(), keranjangBelanja.end(),
                      [&nama](const Barang& b) { return b.nama == nama; });
    
    if (it != keranjangBelanja.end()) {
        it->jumlah += jumlah;
    } else {
        keranjangBelanja.push_back({nama, harga, jumlah});
    }
    cout << "Barang berhasil ditambahkan ke keranjang.\n";
}

string lihatKeranjang() {
    if (keranjangBelanja.empty()) {
        return "Keranjang belanja kosong.\n";
    }
    stringstream ss;
    ss << "ISI KERANJANG:\n";
    ss << setw(3) << left << "NO" << " | " 
       << setw(20) << left << "BARANG" << " | " 
       << setw(13) << left << "HARGA" << " | " 
       << setw(6) << left << "JUMLAH" << "\n";
    ss << string(50, '=') << "\n";
    for (size_t i = 0; i < keranjangBelanja.size(); ++i) {
        ss << setw(3) << left << i+1 << " | " 
           << setw(20) << left << keranjangBelanja[i].nama << " | " 
           << setw(13) << left << formatHarga(keranjangBelanja[i].harga) << " | "
           << setw(6) << left << keranjangBelanja[i].jumlah << "\n";
    }
    ss << string(50, '=') << "\n";
    return ss.str();
}

void hapusBarang(int indeks) {
    if (indeks < 1 || indeks > static_cast<int>(keranjangBelanja.size())) {
        cout << "Nomor barang tidak valid.\n";
        return;
    }
    keranjangBelanja.erase(keranjangBelanja.begin() + indeks - 1);
    cout << "Barang berhasil dihapus dari keranjang.\n";
}

string tampilkanStruk() {
    sort(keranjangBelanja.begin(), keranjangBelanja.end(), bandingkanBarang);
    
    stringstream ss;
    ss << setw(3) << left << "NO" << " | " 
       << setw(20) << left << "BARANG" << " | " 
       << setw(13) << left << "HARGA" << " | " 
       << setw(6) << left << "JUMLAH" << " | " 
       << setw(13) << left << "TOTAL" << "\n";
    ss << string(65, '=') << "\n";

    int totalKeseluruhan = 0;
    int nomorBarang = 1;

    for (const Barang& barang : keranjangBelanja) {
        int totalBarang = barang.harga * barang.jumlah;
        totalKeseluruhan += totalBarang;
        
        ss << setw(3) << left << nomorBarang << " | "
           << setw(20) << left << barang.nama << " | "
           << setw(13) << left << formatHarga(barang.harga) << " | "
           << setw(6) << left << barang.jumlah << " | "
           << setw(13) << left << formatHarga(totalBarang) << "\n";
        nomorBarang++;
    }
    ss << string(65, '=') << "\n";
    ss << setw(45) << right << "TOTAL HARGA: " << setw(13) << left << formatHarga(totalKeseluruhan) << "\n";
    ss << "\nTerima kasih telah berbelanja di Toko Zaid! :)\n";
    
    keranjangBelanja.clear();  // Clear the cart after checkout
    return ss.str();
}

int main() {
    string input;
    while (getline(cin, input)) {
        stringstream ss(input);
        string command;
        ss >> command;

        if (command == "tambah") {
            string nama;
            int harga, jumlah;
            ss >> nama >> harga >> jumlah;
            tambahKeKeranjang(nama, harga, jumlah);
        } else if (command == "lihat") {
            cout << lihatKeranjang();
        } else if (command == "hapus") {
            int indeks;
            ss >> indeks;
            hapusBarang(indeks);
        } else if (command == "selesai") {
            cout << tampilkanStruk();
            break;
        } else {
            cout << "Perintah tidak dikenali.\n";
        }
    }
    return 0;
}
