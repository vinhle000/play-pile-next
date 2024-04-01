const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const logger = require('../../config/logger');

// Authenticate User and get token
const protectRoute = asyncHandler(async (req, res, next) => {
  let token = req.cookies['userToken'];
  if (token) {
    try {

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
  } else {
    res.status(401).json({ message: 'Not authorized, no token' })
  }
});

module.exports = protectRoute;
