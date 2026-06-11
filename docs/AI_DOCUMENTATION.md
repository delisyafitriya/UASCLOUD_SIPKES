# Dokumentasi Integrasi AI SIPKES

SIPKES memiliki fitur chatbot AI yang digunakan sebagai asisten kesehatan awal bagi pasien. Fitur ini membantu pasien memperoleh informasi ringan terkait gejala, pola hidup sehat, dan saran awal sebelum melakukan konsultasi lebih lanjut dengan dokter.

## 1. Tujuan Integrasi AI

AI pada SIPKES digunakan untuk meningkatkan literasi kesehatan awal pasien. Fitur ini tidak digunakan sebagai pengganti diagnosis dokter, melainkan sebagai pendukung informasi awal.

## 2. Alur Kerja AI

1. Pasien membuka fitur chatbot pada dashboard pasien.
2. Pasien mengetik pertanyaan atau keluhan kesehatan.
3. Frontend mengirim request ke backend melalui endpoint `/api/chat`.
4. Backend menerima pesan pasien.
5. Backend meneruskan prompt ke layanan AI.
6. Layanan AI mengembalikan respons.
7. Backend menyimpan pesan pasien dan respons AI ke tabel `chat_histories`.
8. Respons AI ditampilkan kembali pada dashboard pasien.

## 3. Endpoint AI

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | /api/chat | Mengambil riwayat chat pasien |
| POST | /api/chat | Mengirim pertanyaan ke AI dan menerima respons |

## 4. Penyimpanan Riwayat Chat

Riwayat percakapan AI disimpan pada tabel `chat_histories`. Data yang disimpan meliputi ID pasien, pengirim pesan, isi pesan, dan waktu pesan dibuat.

## 5. Batasan AI

Respons AI hanya digunakan untuk edukasi awal. Hasil jawaban AI tidak boleh dianggap sebagai diagnosis medis resmi. Apabila pasien mengalami gejala serius, pasien tetap disarankan untuk berkonsultasi dengan dokter.