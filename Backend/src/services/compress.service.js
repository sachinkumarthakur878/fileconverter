// File Compression Service
// Supports: PDF (remove metadata/compress streams), Images (sharp), TXT (whitespace trim)
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";

/**
 * Compress a PDF file.
 * Technique: Re-save via pdf-lib which strips unused objects and compresses streams.
 * quality: 0.1 (lowest) → 1.0 (highest / least compression)
 */
export const compressPDF = async (inputPath, quality = 0.7) => {
  const inputBytes = await fs.readFile(inputPath);
  const pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });

  // Remove metadata to shrink size
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("CompressIO");
  pdfDoc.setCreator("CompressIO");

  // useObjectStreams compresses cross-reference data
  const useObjectStreams = quality < 0.9;
  const pdfBytes = await pdfDoc.save({ useObjectStreams });

  const outputPath = inputPath.replace(path.extname(inputPath), "-compressed.pdf");
  await fs.writeFile(outputPath, pdfBytes);
  return outputPath;
};

/**
 * Compress an image file using sharp.
 * quality: 0.1 → 1.0 maps to sharp quality 10 → 100
 */
export const compressImage = async (inputPath, quality = 0.7) => {
  const sharp = (await import("sharp")).default;
  const ext = path.extname(inputPath).toLowerCase();
  const sharpQuality = Math.round(quality * 100);

  const outputPath = inputPath.replace(path.extname(inputPath), `-compressed${ext}`);

  const instance = sharp(inputPath);

  if (ext === ".jpg" || ext === ".jpeg") {
    await instance
      .jpeg({ quality: sharpQuality, mozjpeg: true })
      .toFile(outputPath);
  } else if (ext === ".png") {
    // PNG compression level 0–9; quality maps to compressionLevel inversely
    const compressionLevel = Math.round((1 - quality) * 9);
    await instance
      .png({ compressionLevel, adaptiveFiltering: true })
      .toFile(outputPath);
  } else if (ext === ".webp") {
    await instance.webp({ quality: sharpQuality }).toFile(outputPath);
  } else {
    // Fallback: convert to jpeg
    await instance.jpeg({ quality: sharpQuality }).toFile(outputPath);
  }

  return outputPath;
};

/**
 * Compress a plain text file.
 * Removes trailing whitespace, collapses multiple blank lines, strips BOM.
 * quality: above 0.5 = light compression, below = aggressive (also remove comments etc.)
 */
export const compressTXT = async (inputPath, quality = 0.7) => {
  let text = await fs.readFile(inputPath, "utf-8");

  // Strip BOM
  text = text.replace(/^\uFEFF/, "");

  // Remove trailing whitespace on each line
  text = text
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");

  // Collapse multiple blank lines
  if (quality < 0.5) {
    // Aggressive: collapse to single blank line
    text = text.replace(/\n{3,}/g, "\n\n");
  } else {
    // Light: collapse 4+ blank lines to 2
    text = text.replace(/\n{4,}/g, "\n\n\n");
  }

  // Trim leading/trailing whitespace from whole file
  text = text.trim() + "\n";

  const outputPath = inputPath.replace(path.extname(inputPath), "-compressed.txt");
  await fs.writeFile(outputPath, text, "utf-8");
  return outputPath;
};

/**
 * Dispatch compression based on file type
 */
export const compressFile = async (inputPath, originalName, quality = 0.7) => {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".pdf") {
    return compressPDF(inputPath, quality);
  } else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    return compressImage(inputPath, quality);
  } else if (ext === ".txt") {
    return compressTXT(inputPath, quality);
  } else {
    throw new Error(`Compression not supported for ${ext} files. Supported: .pdf, .jpg, .jpeg, .png, .webp, .txt`);
  }
};
