// File controller
import File from "../models/file.model.js";
export const uploadFile = async (req, res) => {
  try {
    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
    });

    res.json({
      message: "File uploaded & saved to DB",
      file,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const convertToPDF = async (req, res) => {
  try {
    // yaha conversion logic aayega
    res.json({ message: "Convert to PDF API working" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const convertToWord = async (req, res) => {
  try {
    // yaha conversion logic aayega
    res.json({ message: "Convert to Word API working" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};