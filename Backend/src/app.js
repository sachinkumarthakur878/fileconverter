// Express app setup
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import fileRoutes from "./routes/file.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/file", fileRoutes);
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;