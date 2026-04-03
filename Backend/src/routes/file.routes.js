// File routes
import express from "express";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  uploadFile,
  convertToPDF,
  convertToWord,
  getUserFiles,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

// Upload file (auth required)
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// Convert routes (auth required)
router.post("/to-pdf", authMiddleware, upload.single("file"), convertToPDF);
router.post("/to-word", authMiddleware, upload.single("file"), convertToWord);

// Get all files for logged-in user
router.get("/my-files", authMiddleware, getUserFiles);

// Delete a file
router.delete("/:id", authMiddleware, deleteFile);

export default router;