// File controller
import File from "../models/file.model.js";
import path from "path";
import fs from "fs";
import { convertTextToPDF, convertDocxToPDF } from "../services/pdf.service.js";
import { convertTextToWord, convertPDFToWord } from "../services/word.service.js";

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

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
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

    // Save record to DB
    const fileRecord = await File.create({
      filename: path.basename(outputPath),
      originalName: req.file.originalname,
      path: inputPath,
      convertedPath: outputPath,
      fileType: "pdf",
      size: req.file.size,
      user: req.user?.id || null,
    });

    // Send the converted file as download
    res.download(outputPath, path.basename(outputPath), (err) => {
      if (err) {
        next(err);
      }
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

    // Save record to DB
    await File.create({
      filename: path.basename(outputPath),
      originalName: req.file.originalname,
      path: inputPath,
      convertedPath: outputPath,
      fileType: "docx",
      size: req.file.size,
      user: req.user?.id || null,
    });

    // Send the converted file as download
    res.download(outputPath, path.basename(outputPath), (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all files for logged-in user
export const getUserFiles = async (req, res, next) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (error) {
    next(error);
  }
};

// Delete a file
export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete physical files
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