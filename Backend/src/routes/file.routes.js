// File routes
import express from "express";
import upload from "../middlewares/upload.middleware.js";
import {
  uploadFile,
  convertToPDF,
  convertToWord,
} from "../controllers/file.controller.js";

const router = express.Router();

// Upload file
router.post("/upload", upload.single("file"), uploadFile);

// Convert
router.post("/to-pdf", upload.single("file"), convertToPDF);
router.post("/to-word", upload.single("file"), convertToWord);

export default router;