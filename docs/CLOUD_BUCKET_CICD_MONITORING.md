# Dokumentasi Bucket Multi-Cloud, CI/CD, dan Monitoring SIPKES

## 1. Bucket Multi-Cloud

SIPKES dirancang menggunakan arsitektur multi-cloud. Aplikasi utama direncanakan berjalan pada AWS EC2, sedangkan penyimpanan dokumen medis pasien menggunakan Google Cloud Storage.

Penggunaan Google Cloud Storage dipilih agar object storage berada pada cloud provider yang berbeda dari layanan utama aplikasi. Dengan demikian, sistem memenuhi kebutuhan multi-cloud architecture.

## 2. Alur Upload Dokumen Medis

1. Pasien mengunggah dokumen medis melalui dashboard pasien.
2. Frontend mengirim file ke backend.
3. Backend menerima file menggunakan middleware upload.
4. File dikirim ke object storage.
5. Object storage menghasilkan URL file.
6. URL file disimpan ke tabel `medical_documents`.
7. Dokter dapat melihat dokumen pasien melalui URL yang tersimpan.

## 3. CI/CD GitHub Actions

CI/CD digunakan untuk mengotomatisasi proses build, test, dockerize, push image, dan deployment aplikasi.

Tahapan pipeline yang disiapkan:

1. Checkout repository.
2. Setup Node.js.
3. Install dependency backend.
4. Menjalankan test jika tersedia.
5. Mendeteksi Dockerfile.
6. Build Docker image.
7. Deploy ke AWS EC2 setelah konfigurasi Docker dan EC2 selesai.

## 4. Monitoring Sistem

Monitoring SIPKES dilakukan melalui beberapa cara:

1. Health check endpoint `/api/health` untuk memeriksa status backend dan database.
2. Audit log pada tabel `audit_logs` untuk mencatat aktivitas penting pengguna.
3. Metrics pada dashboard admin untuk melihat jumlah pasien, dokter, dokumen, dan query AI.
4. AWS CloudWatch untuk monitoring EC2 saat aplikasi sudah berjalan di AWS.

## 5. Catatan Implementasi

Pada tahap pengembangan, CI/CD dan bucket multi-cloud disiapkan terlebih dahulu dalam bentuk konfigurasi awal. Konfigurasi final akan disesuaikan setelah Dockerfile, EC2, dan VPC selesai dibuat.