const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Url = require("./models/urlModel");
const path = require("path");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

dotenv.config(); // ✅ FIXED

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiLimiter);

const urlRoutes = require("./routes/urlRoutes");
app.use("/api/v1", urlRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ code: req.params.code });

    if (!url) return res.status(404).send("URL not found");

    url.clicks++;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Server error");
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
