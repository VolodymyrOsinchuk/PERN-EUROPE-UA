const jwt = require('jsonwebtoken')
const { User } = require('../models/user') // Adjust path as needed
const { verifyJWT } = require('../utils/tokenUtils')

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies
  // console.log("🚀 ~ authMiddleware ~ token :", token);

  // If no authorization header
  if (!token) {
    return res.status(401).json({
      error: 'No token provided',
      message: 'Authentication required',
    })
  }

  try {
    // Verify token
    const { userId, email, role } = await verifyJWT(token)

    // Attach user to request object
    req.user = { userId, email, role }
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    // Handle different types of token errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication failed',
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again',
      })
    }

    // Generic server error
    res.status(500).json({
      error: 'Server error',
      message: 'Authentication process failed',
    })
  }
}

// Optional: Role-based authorization middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Ensure user exists (from previous middleware)
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      })
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      })
    }

    next()
  }
}

module.exports = {
  authMiddleware,
  roleMiddleware,
}
