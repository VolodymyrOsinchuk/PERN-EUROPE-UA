const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function getRequestOrigin(req) {
  const origin = req.get("origin");
  if (origin) return origin;

  const referer = req.get("referer");
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function csrfMiddleware(allowedOrigins) {
  return (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();

    const authorization = req.get("authorization") || "";
    if (/^Bearer\s+\S+/i.test(authorization)) return next();
    if (!req.cookies?.token) return next();

    const origin = getRequestOrigin(req);
    if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: "Джерело запиту не дозволене" });
    }

    next();
  };
}

module.exports = csrfMiddleware;
