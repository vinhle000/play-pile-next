import jwt from 'jsonwebtoken';
import User from '@/lib/models/userModel';
import { auth } from '@/../auth';
import { NextResponse } from 'next/server';

export async function requireOauth(req, res, next) {
  let session = await auth();

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  return NextResponse.next();
}

// Will use for registering user if
// they prefer to use any of the Oauth options
// export async function protectRoute(req, res) {
//   let token;

//   if (req.cookie && req.cookie.userToken) {
//     token = req.cookie.userToken;
//   }

//   if (
//     req.header.authorization &&
//     req.header.authorization.startsWith('Bearer')
//   ) {
//     token = req.header.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: 'Not authorized, no token provided' });
//   }

//   try {
//     // Verify jwt token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Get user from token
//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       res.status(401).json({ message: 'Not authorized, user not found' });
//     }

//     req.user = user;
//     return user;
//   } catch (error) {
//     console.error(`Error authenticating user: ${error.message}`);

//     if (error.name === 'TokenExpiredError') {
//       res.status(401).json({ message: 'Token expired' });
//     } else if (error.name === 'JsonWebTokenError') {
//       res.status(401).json({ message: 'Invalid Token' });
//     } else {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }
// }
