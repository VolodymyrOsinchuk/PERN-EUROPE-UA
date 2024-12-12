const jwt = require("jsonwebtoken");
const { User } = require("../models/user"); // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  console.log(" req.headers", req.headers);
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;

  // If no authorization header
  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided",
      message: "Authentication required",
    });
  }

  // Extract token (expecting "Bearer TOKEN")
  const token = authHeader.split(" ")[1];
  console.log("🚀 ~ authMiddleware ~ token:", token);

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // Exclude password for security
    });
    console.log("🚀 ~ authMiddleware ~ user :", user);

    // If no user found
    if (!user) {
      return res.status(401).json({
        error: "Invalid token",
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle different types of token errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Authentication failed",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        message: "Please log in again",
      });
    }

    // Generic server error
    res.status(500).json({
      error: "Server error",
      message: "Authentication process failed",
    });
  }
};

// Optional: Role-based authorization middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Ensure user exists (from previous middleware)
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
