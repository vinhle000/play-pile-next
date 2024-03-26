const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const logger = require('../../config/logger');

// Authenticate User and get token
const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // check if token is in the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //validate token
      let decode = jwt.verify(token, process.env.JWT_SECRET);

      // get user from token
      req.user = await User.findById(decode.id).select('-password');

      next();
    } catch (error) {
      logger.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      // throw new Error('Not authorized, token failed'); // this is for middleware error handling if you have any`
    }
  }
});

module.exports = protectRoute;
