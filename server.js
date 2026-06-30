import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer"; // Import multer (for its MulterError)
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for the Vite dev server or specific client origin
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json());

connectDB();

// Mount route modules once.
app.use("/", authRoutes);
app.use("/", issueRoutes);

app.get("/", (req, res) => {
  res.send("College Issue Platform API Running");
});

// Global error handler — catches multer errors (file too large, wrong type, etc.)
// and returns a clean JSON response instead of crashing the server.
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (file too large, unexpected field, etc.)
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5 MB." });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message && err.message.toLowerCase().includes("only .jpg")) {
    // Custom error from our fileFilter in middleware/upload.js
    return res.status(400).json({ message: err.message });
  }

  // Fallback for unknown errors — log and return a generic message.
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
