// src/routes/appointmentRoutes.mjs
import express from 'express';
import Appointment from '../models/appointmentModel.mjs';
import User from '../models/userModel.mjs';
import { auth } from '../utils/auth.mjs';

const router = express.Router();

// Get appointments for the logged-in doctor
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'doctor') {
      return res.status(403).json({ msg: 'Only doctors can view appointments' });
    }
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .exec();
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Book appointment
router.post('/book', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'patient') {
      return res.status(403).json({ msg: 'Only patients can book appointments' });
    }

    const { doctorId, date, timeSlot } = req.body;
    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ msg: 'Please provide doctorId, date, and timeSlot' });
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.userType !== 'doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Optional: Check if the timeSlot is available
    // Implement logic to verify doctor's availability on the given date and timeSlot

    const appointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date,
      timeSlot,
    });
    await appointment.save();
    console.log(`Appointment booked by patient ${req.user.id} with doctor ${doctorId}`);
    res.status(201).json({ msg: 'Appointment booked successfully' });
  } catch (err) {
    console.error('Error booking appointment:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update appointment status


// Update appointment status
router.put('/:id', auth, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if the user is authorized to update this appointment
    if (req.user.userType === 'doctor' && appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Unauthorized to update this appointment' });
    }

    // Update the status
    appointment.status = status;
    await appointment.save();

    res.json({ msg: 'Appointment status updated successfully', appointment });
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
