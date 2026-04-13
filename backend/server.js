// ===========================
// server.js — Entry point
// ===========================

// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, "../frontend")));

// ─── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Root route (VERY IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});

// ─── MongoDB Connection ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Debug (remove later if you want)
console.log("MONGO_URI:", MONGO_URI ? "Loaded ✅" : "Missing ❌");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
