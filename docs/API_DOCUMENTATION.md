# Dokumentasi API SIPKES

## 1. Auth API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| POST | /api/auth/register | Registrasi akun pasien atau dokter | Public |
| POST | /api/auth/login | Login pengguna | Public |

## 2. Patient API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /api/patient/vitals | Menampilkan riwayat tanda vital pasien | Patient |
| POST | /api/patient/vitals | Menambahkan data tanda vital pasien | Patient |
| GET | /api/patient/documents | Menampilkan dokumen medis pasien | Patient |
| POST | /api/patient/documents | Upload dokumen medis pasien | Patient |

## 3. Chat AI API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /api/chat | Menampilkan riwayat chat AI | Patient |
| POST | /api/chat | Mengirim pertanyaan ke chatbot AI | Patient |

## 4. Doctor API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /api/doctor/patients | Menampilkan daftar pasien | Doctor |
| GET | /api/doctor/patient/:id | Menampilkan detail pasien | Doctor |
| POST | /api/doctor/record/:recordId/notes | Menambahkan catatan dokter pada data kesehatan pasien | Doctor |

## 5. Admin API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /api/admin/metrics | Menampilkan statistik sistem | Admin |
| GET | /api/admin/doctors | Menampilkan daftar dokter | Admin |
| POST | /api/admin/doctors/:id/approve | Menyetujui akun dokter | Admin |
| POST | /api/admin/doctors/:id/suspend | Menahan akun dokter | Admin |
| GET | /api/admin/audit-logs | Menampilkan log aktivitas sistem | Admin |
| GET | /api/admin/patients | Menampilkan daftar pasien | Admin |

## 6. Monitoring API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| GET | /api/health | Mengecek status backend dan database | Public |