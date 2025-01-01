// src/routes/doctorRoutes.mjs
import express from 'express';
import User from '../models/userModel.mjs';
import { auth } from '../utils/auth.mjs';

const router = express.Router();

// Update doctor's availability
router.put('/availability', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'doctor') {
      return res.status(403).json({ msg: 'Only doctors can update availability' });
    }

    const { availability } = req.body;
    if (!availability || !Array.isArray(availability)) {
      return res.status(400).json({ msg: 'Invalid availability format' });
    }

    // Validate each availability entry
    for (let entry of availability) {
      if (!entry.date || !entry.slots || !Array.isArray(entry.slots)) {
        return res.status(400).json({ msg: 'Each availability entry must have a date and slots array' });
      }
      // Optionally, validate date format and slot formats
      if (isNaN(Date.parse(entry.date))) {
        return res.status(400).json({ msg: 'Invalid date format in availability' });
      }
      if (!entry.slots.every(slot => /^\d{2}:\d{2}$/.test(slot))) {
        return res.status(400).json({ msg: 'Each slot must match the format "HH:MM"' });
      }
    }

    const updatedDoctor = await User.findByIdAndUpdate(
      req.user.id,
      { availability },
      { new: true }
    ).select('-password');

    if (!updatedDoctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    console.log(`Doctor ${req.user.id} updated availability`);

    res.json({ msg: 'Availability updated successfully', doctor: updatedDoctor });
  } catch (err) {
    console.error('Error updating availability:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
