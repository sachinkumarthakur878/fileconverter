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
      return new Paragraph({ spacing: { after: 200 } });
    }
    return new Paragraph({
      children: [new TextRun({ text: trimmed, size: 24, font: "Calibri" })],
      spacing: { after: 120 },
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
 * Converts a .pdf file to .docx using pdf-parse for real text extraction
 */
export const convertPDFToWord = async (inputPath) => {
  let extractedText = "";

  try {
    const { default: pdfParse } = await import("pdf-parse");
    const dataBuffer = await fs.readFile(inputPath);
    const pdfData = await pdfParse(dataBuffer);
    extractedText = pdfData.text || "";

    // Normalise whitespace
    extractedText = extractedText
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  } catch (parseError) {
    console.warn("pdf-parse error:", parseError.message);
    extractedText =
      `[Converted from PDF: ${path.basename(inputPath)}]\n\n` +
      `Note: This PDF may be scanned/image-based and requires OCR for full text extraction.\n`;
  }

  const lines = extractedText.split("\n");
  const paragraphs = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      paragraphs.push(new Paragraph({ spacing: { after: 200 } }));
      continue;
    }

    // Heuristic heading detection
    const nextLine = lines[i + 1]?.trim() ?? "";
    const isLikelyHeading =
      line.length < 80 &&
      (line === line.toUpperCase() || nextLine === "") &&
      line.length > 2;

    if (isLikelyHeading) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: line, bold: true, size: 28, font: "Calibri" })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: 24, font: "Calibri" })],
          spacing: { after: 120 },
        })
      );
    }
  }

  const metaParagraph = new Paragraph({
    children: [
      new TextRun({
        text: `Converted from: ${path.basename(inputPath)}`,
        italics: true,
        size: 18,
        color: "888888",
        font: "Calibri",
      }),
    ],
    spacing: { after: 400 },
  });

  const doc = new Document({
    sections: [{ properties: {}, children: [metaParagraph, ...paragraphs] }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = inputPath.replace(path.extname(inputPath), "-converted.docx");
  await fs.writeFile(outputPath, buffer);
  return outputPath;
};
