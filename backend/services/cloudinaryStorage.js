const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return resolve(null);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sipkes/medical-documents',
        resource_type: 'auto',
        public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

module.exports = { uploadToCloudinary };