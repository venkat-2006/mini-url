const Url = require("../models/urlModel");
const { nanoid } = require("nanoid");

const createShortUrl = async (req, res, next) => {
  try {
    const { longUrl, clientId } = req.body;
    const code = nanoid(6);
    const url = await Url.create({ longUrl, code, clientId });
    res.status(201).json({
      success: true,
      data: {
        id: url._id,
        code: url.code,
        longUrl: url.longUrl,
        shortUrl: `${process.env.BASE_URL}/${url.code}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserUrls = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const urls = await Url.find({ clientId }).sort({ createdAt: -1 }).limit(20).select("-__v");
    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls.map((url) => ({
        id: url._id,
        code: url.code,
        longUrl: url.longUrl,
        shortUrl: `${process.env.BASE_URL}/${url.code}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getUrlStats = async (req, res, next) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ code }).select("-__v");
    if (!url) {
      res.status(404);
      throw new Error("URL not found");
    }
    res.status(200).json({
      success: true,
      data: {
        id: url._id,
        code: url.code,
        longUrl: url.longUrl,
        shortUrl: `${process.env.BASE_URL}/${url.code}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUrl = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { clientId } = req.body;
    const url = await Url.findOne({ code, clientId });
    if (!url) {
      res.status(404);
      throw new Error("URL not found or unauthorized");
    }
    await url.deleteOne();
    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlStats,
  deleteUrl,
};
