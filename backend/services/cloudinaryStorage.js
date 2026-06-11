const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // Pastikan package ini ada, jika tidak ada, jalankan: npm install streamifier

// Mengonfigurasi kredensial Cloudinary dari file .env Anda
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Memeriksa apakah token di .env berhasil terbaca
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Kredensial Cloudinary tidak ditemukan di berkas .env!");
      return resolve(null);
    }

    // Mengubah buffer memori multer menjadi stream data untuk dikirim ke Cloudinary
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: 'sipkes_cdn_documents',
        resource_type: 'auto' // Menangani gambar maupun file PDF secara otomatis
      },
      (error, result) => {
        if (error) {
          console.error("Gagal mengirim aset ke Cloudinary:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

module.exports = { uploadToCloudinary };