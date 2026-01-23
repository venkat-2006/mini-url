const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    longUrl: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },

    clientId: { type: String, required: true }, //
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
