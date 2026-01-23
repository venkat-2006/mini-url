const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { nanoid } = require("nanoid");
const Url = require("./models/urlModel");
const path = require("path");

dotenv.config({ path: "./backend/.env" });


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  API: shorten
app.post("/api/shorten", async (req, res) => {
  try {
    const longUrl = req.body?.longUrl;
    const clientId = req.body?.clientId;

    if (!longUrl) return res.status(400).json({ message: "longUrl required" });
    if (!clientId) return res.status(400).json({ message: "clientId required" });

    const code = nanoid(6);
    const saved = await Url.create({ longUrl, code, clientId });

    return res.json({
      code: saved.code,
      shortUrl: `${process.env.BASE_URL}/${saved.code}`,
    });
  } catch (e) {
    console.log("❌ /api/shorten error:", e);
    return res.status(500).json({ message: e.message });
  }
});

//  API: list my urls
app.get("/api/my-urls/:clientId", async (req, res) => {
  try {
    const urls = await Url.find({ clientId: req.params.clientId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(
      urls.map((u) => ({
        longUrl: u.longUrl,
        code: u.code,
        clicks: u.clicks,
        shortUrl: `${process.env.BASE_URL}/${u.code}`,
      }))
    );
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

//  Redirect (KEEP THIS AFTER API routes)
app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ code: req.params.code });
    if (!url) return res.status(404).send("Not found");

    url.clicks++;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (e) {
    console.log("❌ redirect error:", e);
    return res.status(500).send(e.message);
  }
});

//  Serve frontend (single deploy)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.log("❌ Mongo error:", e.message));

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
