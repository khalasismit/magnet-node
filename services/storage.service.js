import admin from "firebase-admin";
import sharp from "sharp";
import serviceAccount from "../config/serviceacc.json" with { type: 'json' };
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

export const compressImage = async (buffer, width = 800) => {
  return sharp(buffer)
    .rotate()
    .resize({ width })
    .webp()
    .toBuffer();
};

export const uploadFileToStorage = async (buffer, originalName, contentType = 'image/webp') => {
  const fileName = `${Date.now()}-${originalName}.webp`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', async () => {
      try {
        const [downloadUrl] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '9999-12-31T23:59:59Z',
        });
        resolve({
          name: fileName,
          url: downloadUrl,
        });
      } catch (err) {
        reject(err);
      }
    });

    stream.end(buffer);
  });
};

/**
 * Gets a signed URL for a file in the bucket.
 * @param {string} fileName - Name of the file in the bucket.
 * @returns {Promise<string>} The signed download URL.
 */
export const getSignedUrlForFile = async (fileName) => {
  const fileUpload = bucket.file(fileName);
  const [downloadUrl] = await fileUpload.getSignedUrl({
    action: 'read',
    expires: '9999-12-31T23:59:59Z',
  });
  return downloadUrl;
};
