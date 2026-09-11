import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer"; // Import multer (for its MulterError)
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://campus-voice-eosin.vercel.app",
  "https://campus-voice-n4poi0hcy-adarsh7978s-projects.vercel.app",
];

if (process.env.CLIENT_ORIGIN) {
  process.env.CLIENT_ORIGIN.split(",").forEach((o) => {
    const origin = String(o || "").trim();
    if (origin && !allowedOrigins.includes(origin)) allowedOrigins.push(origin);
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    try {
      const hostname = new URL(origin).hostname || "";
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return callback(null, true);
      }
      if (hostname.endsWith(".vercel.app")) {
        return callback(null, true);
      }
    } catch (e) {
      // fall through to rejection
    }

    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

connectDB();

// Mount route modules once with the /api prefix so requests from the Vercel
// frontend land on the correct Express handlers.
app.use("/api", authRoutes);
app.use("/api", issueRoutes);

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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
