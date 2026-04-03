// File model
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    convertedPath: { type: String, default: null },
    fileType: { type: String }, // e.g. "pdf", "docx"
    size: { type: Number },     // in bytes
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);