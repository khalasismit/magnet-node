import File from "../models/File.model.js";
import { compressImage, uploadFileToStorage } from "../services/storage.service.js";

/**
 * Handle file upload request.
 */
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Compress the image using sharp (integrated via storage service)
    const compressedImageBuffer = await compressImage(file.buffer);

    // Upload file to Firebase storage
    const { name: fileName, url: downloadUrl } = await uploadFileToStorage(
      compressedImageBuffer, 
      file.originalname, 
      'image/webp'
    );

    // Save metadata in database
    const newFile = new File({
      name: fileName,
      originalName: file.originalname,
      mimetype: 'image/webp',
      url: downloadUrl,
    });
    await newFile.save();

    return res.status(200).json(newFile._id);
  } catch (error) {
    console.error("Upload controller error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Handle file URL download/retrieval request.
 */
export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ error: "fileId is required" });
    }
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    return res.status(200).json(file.url);
  } catch (err) {
    console.error("Download controller error:", err);
    return res.status(400).json({ error: err.toString() });
  }
};
