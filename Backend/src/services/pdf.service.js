// PDF conversion service
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

/**
 * Converts a plain text (.txt) file to PDF
 */
export const convertTextToPDF = async (inputPath) => {
  const text = await fs.readFile(inputPath, "utf-8");

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize + 6;

  // Split text into lines
  const rawLines = text.split("\n");
  const maxCharsPerLine = 90;
  const lines = [];

  for (const rawLine of rawLines) {
    // Word wrap long lines
    if (rawLine.length <= maxCharsPerLine) {
      lines.push(rawLine);
    } else {
      const words = rawLine.split(" ");
      let currentLine = "";
      for (const word of words) {
        if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
          currentLine = (currentLine + " " + word).trim();
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
    }
  }

  const pageHeight = 792;
  const pageWidth = 612;
  const usableHeight = pageHeight - margin * 2;
  const linesPerPage = Math.floor(usableHeight / lineHeight);

  // Paginate
  for (let i = 0; i < lines.length; i += linesPerPage) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const pageLines = lines.slice(i, i + linesPerPage);

    pageLines.forEach((line, idx) => {
      page.drawText(line, {
        x: margin,
        y: pageHeight - margin - idx * lineHeight,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  }

  const pdfBytes = await pdfDoc.save();

  // Save to output path
  const outputPath = inputPath.replace(path.extname(inputPath), "-converted.pdf");
  await fs.writeFile(outputPath, pdfBytes);

  return outputPath;
};

/**
 * Converts a .docx file to PDF by extracting text via mammoth, then building PDF
 */
export const convertDocxToPDF = async (inputPath) => {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ path: inputPath });
  const text = result.value;

  // Write text to a temp .txt file and reuse text->PDF
  const tempTxt = inputPath + ".tmp.txt";
  await fs.writeFile(tempTxt, text, "utf-8");

  const outputPath = await convertTextToPDF(tempTxt);

  // Cleanup temp
  await fs.unlink(tempTxt).catch(() => {});

  // Rename output to reflect original name
  const finalPath = inputPath.replace(path.extname(inputPath), "-converted.pdf");
  await fs.rename(outputPath, finalPath).catch(() => {});

  return finalPath;
};