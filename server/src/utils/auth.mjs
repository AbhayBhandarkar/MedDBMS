// src/utils/auth.mjs
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET } = process.env;

// Generate a JWT Token
export function generateToken(user) {
  return jwt.sign(
    { userId: user._id, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Middleware to Authenticate JWT
export function auth(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid token' });
  }
}
