# SIPKES (Sistem Pemantauan Kesehatan) 🩺

SIPKES adalah aplikasi berbasis web cerdas untuk memantau indikator kesehatan (Tele-monitoring) yang terintegrasi dengan Asisten AI. Aplikasi ini dirancang untuk menyelesaikan tantangan aksesibilitas pemantauan kesehatan jarak jauh dan memberikan deteksi dini kelainan tanda vital, sejalan dengan tujuan **Sustainable Development Goals (SDGs) Ke-3: *Good Health and Well-being* (Kehidupan Sehat dan Sejahtera)**.

## 🌟 Fitur Utama Berdasarkan Peran (Role-Based)

### 🧑‍⚕️ 1. Dashboard Dokter (Tele-monitoring)
- **Antrean Pasien Aktif**: Memantau seluruh pasien yang ditugaskan dalam satu layar.
- **Deteksi Dini Otomatis (Early Warning)**: Indikator "Waspada" (merah) akan menyala jika ada kelainan pada tekanan darah atau detak jantung pasien, mempercepat respons medis darurat.
- **Tinjauan Medis Komprehensif**: Melihat grafik riwayat kesehatan pasien, deskripsi gejala harian, dan mengunduh/melihat dokumen medis lampiran.
- **E-Prescription & Catatan**: Menambahkan catatan klinis atau anjuran elektronik secara spesifik ke rekaman vital pasien.

### 🤒 2. Dashboard Pasien (Pemantauan Mandiri)
- **Input Tanda Vital Harian**: Pencatatan detak jantung (HR), tekanan darah (BP), suhu tubuh, dan keluhan/gejala secara mandiri dari rumah.
- **Visualisasi Tren**: Melihat pergerakan indikator kesehatan diri sendiri dalam grafik interaktif (*Line Chart*).
- **Unggah Dokumen**: Mengunggah hasil lab atau *X-Ray* (mendukung gambar dan PDF).
- **Asisten Kesehatan AI 24/7**: Terhubung dengan *Hugging Face LLM* untuk konsultasi awal dan literasi keluhan penyakit ringan sebelum tindakan dokter.

### 🛡️ 3. Dashboard Admin (Keamanan & Manajemen)
- **Kontrol Hak Akses**: Melakukan penyortiran (Setuju/Tahan) pendaftaran akun Dokter untuk validasi izin praktik.
- **Manajemen Penuh**: Operasi CRUD penuh untuk akun Pasien dan Dokter.
- **Statistik Sistem**: Ringkasan jumlah pengguna aktif, dokumen masuk, dan penggunaan AI.
- **Security Audit Log**: Melacak semua kejadian di sistem (Login, Hapus data, Persetujuan) secara _real-time_.

---

## 💻 Stack Teknologi
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS, Chart.js, FontAwesome.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **AI Integrasi**: Hugging Face Inference API.
- **Autentikasi**: JWT (JSON Web Tokens), bcrypt (Password Hashing).

---

## 🚀 Cara Menjalankan Secara Lokal (Local Setup)

### Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (v16 atau lebih baru)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) atau XAMPP.

### Langkah Instalasi
1. **Clone Repository ini**
   ```bash
   git clone https://github.com/delisyafitriya/UASCLOUD_SIPKES.git
   cd UASCLOUD_SIPKES
   ```

2. **Pengaturan Database**
   - Buka MySQL atau phpMyAdmin Anda.
   - Jalankan semua sintaks SQL yang ada di dalam file `database/init.sql` untuk membuat tabel dan memasukkan data _dummy_ (akun pengujian awal).

3. **Instalasi Dependensi Backend**
   ```bash
   cd backend
   npm install
   ```

4. **Konfigurasi Environment**
   Di dalam folder `backend/`, buat file `.env` dan masukkan konfigurasi berikut (sesuaikan dengan _password_ MySQL Anda):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=health_monitoring
   JWT_SECRET=supersecretkey123
   PORT=5000
   HF_TOKEN=hf_TokenHuggingFaceAndaDisini
   ```

5. **Jalankan Server**
   ```bash
   npm start
   ```
   *Pesan "Server running on http://localhost:5000" akan muncul jika berhasil.*

6. **Buka Aplikasi Frontend**
   Buka file `frontend/login.html` langsung dari *File Explorer* Anda (atau gunakan ekstensi *Live Server* di VS Code) ke browser.

---

## 🔑 Akun Demo (Berdasarkan `init.sql`)

Anda dapat mencoba *login* menggunakan akun bawaan berikut (Kata Sandi untuk semua akun di bawah adalah: **`password123`**):

- **Admin**: `admin@mail.com`
- **Dokter**: `budi@mail.com`
- **Pasien**: `ahmad@mail.com`

---
*Dibuat untuk keperluan Tugas Akhir / Proyek Komputasi Awan (Cloud Computing).*
