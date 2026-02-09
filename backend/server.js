const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { nanoid } = require("nanoid");
const Url = require("./models/urlModel");
const path = require("path");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Load environment variables
dotenv.config({ path: "./backend/.env" });

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// API Routes (versioned)
const urlRoutes = require("./routes/urlRoutes");
app.use("/api/v1", urlRoutes);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Redirect functionality (NOT part of public API)
app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ code: req.params.code });
    if (!url) {
      return res.status(404).send("URL not found");
    }
    // Increment click count
    url.clicks++;
    await url.save();
    // Redirect to original URL
    return res.redirect(url.longUrl);
  } catch (error) {
    console.error("❌ Redirect error:", error);
    return res.status(500).send("Server error");
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api/v1`);
});
