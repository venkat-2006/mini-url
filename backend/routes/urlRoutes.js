const express = require("express");
const { createShortUrl, getUserUrls, getUrlStats, deleteUrl } = require("../controllers/urlController");
const { validateCreateUrl, validateClientId } = require("../middleware/validateRequest");
const { createUrlLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/urls", createUrlLimiter, validateCreateUrl, createShortUrl);
router.get("/urls/client/:clientId", validateClientId, getUserUrls);
router.get("/urls/:code/stats", getUrlStats);
router.delete("/urls/:code", deleteUrl);

module.exports = router;
