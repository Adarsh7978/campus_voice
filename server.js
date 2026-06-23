import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Mount route modules.
app.use("/", authRoutes);
app.use("/", issueRoutes);

// Mount authentication routes and issue routes.
app.use("/", authRoutes);
app.use("/", issueRoutes);

app.get("/", (req, res) => {
  res.send("College Issue Platform API Running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
