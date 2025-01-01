// seedAppointments.mjs
import 'dotenv/config';
import mongoose from 'mongoose';
import Appointment from './src/models/appointmentModel.mjs';
import User from './src/models/userModel.mjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/neurohelpdb';

async function seedAppointments() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding appointments...');

    // Fetch existing doctors and patients
    const doctors = await User.find({ userType: 'doctor' });
    const patients = await User.find({ userType: 'patient' });

    if (doctors.length === 0 || patients.length === 0) {
      console.log('No doctors or patients found. Please seed users first.');
      process.exit(1);
    }

    // Create sample appointments
    const appointmentsData = [
      {
        doctor: doctors[0]._id,
        patient: patients[0]._id,
        date: new Date('2024-12-31'),
        timeSlot: '09:00',
        status: 'pending',
      },
      {
        doctor: doctors[1]._id,
        patient: patients[1]._id,
        date: new Date('2025-01-01'),
        timeSlot: '14:00',
        status: 'confirmed',
      },
      // Add more appointments as needed
    ];

    for (let appt of appointmentsData) {
      const existing = await Appointment.findOne({
        doctor: appt.doctor,
        patient: appt.patient,
        date: appt.date,
        timeSlot: appt.timeSlot,
      });
      if (!existing) {
        await Appointment.create(appt);
        console.log(`Seeded appointment on ${appt.date.toDateString()} at ${appt.timeSlot}`);
      } else {
        console.log(`Appointment on ${appt.date.toDateString()} at ${appt.timeSlot} already exists.`);
      }
    }

    console.log('Appointment seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedAppointments();
