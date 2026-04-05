// File controller
import File from "../models/file.model.js";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { convertTextToPDF, convertDocxToPDF } from "../services/pdf.service.js";
import { convertTextToWord, convertPDFToWord } from "../services/word.service.js";
import { compressFile } from "../services/compress.service.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      fileType: path.extname(req.file.originalname).replace(".", "").toLowerCase(),
      size: req.file.size,
      user: req.user?.id || null,
    });

    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    next(error);
  }
};

export const convertToPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let outputPath;

    if (ext === ".txt") {
      outputPath = await convertTextToPDF(inputPath);
    } else if (ext === ".docx" || ext === ".doc") {
      outputPath = await convertDocxToPDF(inputPath);
    } else {
      return res.status(400).json({
        message: `Conversion to PDF not supported for ${ext} files. Supported: .txt, .docx`,
      });
    }

    await File.create({
      filename: path.basename(outputPath),
      originalName: req.file.originalname,
      path: inputPath,
      convertedPath: outputPath,
      fileType: "pdf",
      size: req.file.size,
      user: req.user?.id || null,
    });

    res.download(outputPath, path.basename(outputPath), (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
};

export const convertToWord = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let outputPath;

    if (ext === ".txt") {
      outputPath = await convertTextToWord(inputPath);
    } else if (ext === ".pdf") {
      outputPath = await convertPDFToWord(inputPath);
    } else {
      return res.status(400).json({
        message: `Conversion to Word not supported for ${ext} files. Supported: .txt, .pdf`,
      });
    }

    await File.create({
      filename: path.basename(outputPath),
      originalName: req.file.originalname,
      path: inputPath,
      convertedPath: outputPath,
      fileType: "docx",
      size: req.file.size,
      user: req.user?.id || null,
    });

    res.download(outputPath, path.basename(outputPath), (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
};

export const compressFileHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // quality: float 0.1–1.0 (sent from frontend as string)
    const quality = parseFloat(req.body.quality ?? "0.7");
    if (isNaN(quality) || quality < 0.1 || quality > 1.0) {
      return res.status(400).json({ message: "quality must be between 0.1 and 1.0" });
    }

    const inputPath = req.file.path;
    const outputPath = await compressFile(inputPath, req.file.originalname, quality);

    // Get compressed file size for response header
    const stats = await fsPromises.stat(outputPath);
    const compressedSize = stats.size;

    await File.create({
      filename: path.basename(outputPath),
      originalName: req.file.originalname,
      path: inputPath,
      convertedPath: outputPath,
      fileType: path.extname(outputPath).replace(".", "").toLowerCase(),
      size: req.file.size,
      compressedSize,
      user: req.user?.id || null,
    });

    // Send compressed size as header so frontend can show saving %
    res.setHeader("X-Original-Size", req.file.size);
    res.setHeader("X-Compressed-Size", compressedSize);

    res.download(outputPath, path.basename(outputPath), (err) => {
      if (err) next(err);
    });
  } catch (error) {
    // Pass user-friendly message
    if (error.message.includes("not supported")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const getUserFiles = async (req, res, next) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    [file.path, file.convertedPath].forEach((filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};
