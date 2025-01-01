// src/routes/medicalRecordRoutes.mjs
import express from 'express';
import MedicalRecord from '../models/MedicalRecordModel.mjs';
import User from '../models/userModel.mjs';
import { auth } from '../utils/auth.mjs';

const router = express.Router();

// Create a medical record (Doctors only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'doctor') {
      return res.status(403).json({ msg: 'Only doctors can create medical records' });
    }

    const { patientId, record } = req.body;
    if (!patientId || !record) {
      return res.status(400).json({ msg: 'Please provide patientId and record' });
    }

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.userType !== 'patient') {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const medicalRecord = new MedicalRecord({
      doctor: req.user.userId,
      patient: patientId,
      record,
    });

    await medicalRecord.save();
    console.log(`Medical record created for patient ${patientId} by doctor ${req.user.userId}`);
    res.status(201).json({ msg: 'Medical record created successfully', medicalRecord });
  } catch (err) {
    console.error('Error creating medical record:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get medical records (Patients can view their own, Doctors can view their patients')
router.get('/', auth, async (req, res) => {
  try {
    let records;
    if (req.user.userType === 'patient') {
      records = await MedicalRecord.find({ patient: req.user.userId })
        .populate('doctor', 'name email specialization')
        .exec();
    } else if (req.user.userType === 'doctor') {
      records = await MedicalRecord.find({ doctor: req.user.userId })
        .populate('patient', 'name email')
        .exec();
    } else {
      return res.status(403).json({ msg: 'Invalid user type' });
    }

    res.json(records);
  } catch (err) {
    console.error('Error fetching medical records:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a medical record (Doctors only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'doctor') {
      return res.status(403).json({ msg: 'Only doctors can update medical records' });
    }

    const { id } = req.params;
    const { record } = req.body;

    if (!record) {
      return res.status(400).json({ msg: 'Please provide updated record' });
    }

    const medicalRecord = await MedicalRecord.findById(id);
    if (!medicalRecord) {
      return res.status(404).json({ msg: 'Medical record not found' });
    }

    if (medicalRecord.doctor.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Unauthorized to update this medical record' });
    }

    medicalRecord.record = record;
    await medicalRecord.save();
    console.log(`Medical record ${id} updated by doctor ${req.user.userId}`);

    res.json({ msg: 'Medical record updated successfully', medicalRecord });
  } catch (err) {
    console.error('Error updating medical record:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a medical record (Doctors only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'doctor') {
      return res.status(403).json({ msg: 'Only doctors can delete medical records' });
    }

    const { id } = req.params;

    const medicalRecord = await MedicalRecord.findById(id);
    if (!medicalRecord) {
      return res.status(404).json({ msg: 'Medical record not found' });
    }

    if (medicalRecord.doctor.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Unauthorized to delete this medical record' });
    }

    await medicalRecord.remove();
    console.log(`Medical record ${id} deleted by doctor ${req.user.userId}`);

    res.json({ msg: 'Medical record deleted successfully' });
  } catch (err) {
    console.error('Error deleting medical record:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
