// File helper functions
import path from "path";

export const getFileExtension = (filename) => {
  return path.extname(filename);
};

export const getFileName = (filename) => {
  return path.basename(filename);
};