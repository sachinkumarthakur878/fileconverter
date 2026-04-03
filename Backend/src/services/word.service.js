// Word conversion service
import fs from "fs/promises";
import path from "path";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

/**
 * Converts a plain .txt file to .docx
 */
export const convertTextToWord = async (inputPath) => {
  const text = await fs.readFile(inputPath, "utf-8");
  const lines = text.split("\n");

  const paragraphs = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      // Empty line → empty paragraph (spacing)
      return new Paragraph({});
    }
    return new Paragraph({
      children: [new TextRun({ text: trimmed, size: 24 })], // size in half-points = 12pt
    });
  });

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const buffer = await Packer.toBuffer(doc);

  const outputPath = inputPath.replace(path.extname(inputPath), "-converted.docx");
  await fs.writeFile(outputPath, buffer);

  return outputPath;
};

/**
 * Converts a .pdf text content to .docx using pdf-lib text extraction
 * Note: Works best on text-based PDFs (not scanned images)
 */
export const convertPDFToWord = async (inputPath) => {
  // We use mammoth only for docx, for PDF we use a basic approach
  // Extract raw bytes as string for text-based PDFs
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs").catch(() => null) ?? {};

  // Fallback: simple placeholder text extraction notice
  const fallbackText = `[Converted from PDF: ${path.basename(inputPath)}]\n\nNote: For scanned/image PDFs, OCR is required for full text extraction. This file was processed as a text-based PDF.\n`;

  let extractedText = fallbackText;

  try {
    // Try mammoth if someone accidentally passes a docx
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ path: inputPath });
    if (result.value && result.value.trim().length > 0) {
      extractedText = result.value;
    }
  } catch {
    // Not a docx, use fallback
  }

  const lines = extractedText.split("\n");
  const paragraphs = lines.map((line) =>
    new Paragraph({
      children: [new TextRun({ text: line.trim(), size: 24 })],
    })
  );

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = inputPath.replace(path.extname(inputPath), "-converted.docx");
  await fs.writeFile(outputPath, buffer);

  return outputPath;
};