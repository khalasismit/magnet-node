import express from "express";
import multer from "multer";
import { uploadFile, downloadFile } from "../controllers/upload.controller.js";
import { validateRequest } from "../validation/validate.middleware.js";
import { downloadFileSchema } from "../validation/upload.validation.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single("file"), uploadFile);
router.post('/download', validateRequest(downloadFileSchema), downloadFile);

export default router;
