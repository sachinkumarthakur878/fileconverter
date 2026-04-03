// Error middleware
import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max size is 50MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  // Custom file type error
  if (err.message && err.message.includes("File type not allowed")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;