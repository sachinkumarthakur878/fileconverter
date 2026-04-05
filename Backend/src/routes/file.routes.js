// File routes
import express from "express";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  uploadFile,
  convertToPDF,
  convertToWord,
  compressFileHandler,
  getUserFiles,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

// Upload file
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// Convert routes
router.post("/to-pdf", authMiddleware, upload.single("file"), convertToPDF);
router.post("/to-word", authMiddleware, upload.single("file"), convertToWord);

// Compress route — quality sent as form field alongside the file
router.post("/compress", authMiddleware, upload.single("file"), compressFileHandler);

// Get all files for logged-in user
router.get("/my-files", authMiddleware, getUserFiles);

// Delete a file
router.delete("/:id", authMiddleware, deleteFile);

export default router;
