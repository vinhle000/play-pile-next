const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const logger = require('../../config/logger');

// Authenticate User and get token
const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is provided in the cookies
  if (req.cookies && req.cookies.userToken) {
    token = req.cookies.userToken;
  }

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the user from the token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    logger.error(`Error authenticating user: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
});

module.exports = protectRoute;