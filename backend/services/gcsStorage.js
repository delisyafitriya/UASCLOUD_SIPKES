const { Storage } = require('@google-cloud/storage');

const bucketName = process.env.GCS_BUCKET_NAME;

let storage = null;

if (process.env.GCS_KEYFILE) {
    storage = new Storage({
        keyFilename: process.env.GCS_KEYFILE
    });
}

async function uploadToGCS(file) {
    if (!storage || !bucketName) {
        return null;
    }

    const safeName = file.originalname.replace(/\s+/g, '_');
    const fileName = `medical-documents/${Date.now()}-${safeName}`;

    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileName);

    await blob.save(file.buffer, {
        metadata: {
            contentType: file.mimetype
        },
        resumable: false
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

module.exports = { uploadToGCS };