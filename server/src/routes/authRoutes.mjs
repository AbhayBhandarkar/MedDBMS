// src/routes/authRoutes.mjs
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.mjs';
import { generateToken } from '../utils/auth.mjs';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType, specialization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`User already exists: ${email}`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    const user = new User({ name, email, password, userType, specialization });
    await user.save();
    console.log(`User registered: ${email}`);
    res.status(201).json({ msg: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('No user found with this email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('Password mismatch for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user);
    console.log('Token generated for user:', user.email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ userType: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    console.error('Fetch doctors error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
