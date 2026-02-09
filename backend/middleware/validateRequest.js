const validateUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const validateCreateUrl = (req, res, next) => {
  const { longUrl, clientId } = req.body;

  if (!longUrl) {
    res.status(400);
    throw new Error("longUrl is required");
  }

  if (!clientId) {
    res.status(400);
    throw new Error("clientId is required");
  }

  if (!validateUrl(longUrl)) {
    res.status(400);
    throw new Error("Invalid URL format. Must be a valid HTTP/HTTPS URL.");
  }

  next();
};

const validateClientId = (req, res, next) => {
  const { clientId } = req.params;

  if (!clientId) {
    res.status(400);
    throw new Error("clientId is required");
  }

  next();
};

module.exports = { validateCreateUrl, validateClientId };
