// seedPatients.mjs
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/userModel.mjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/neurohelpdb';

async function seedPatients() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding patients...');

    // Create some example patients
    const patientsData = [
      {
        name: 'John Doe',
        email: 'john@patient.com',
        password: 'password123',
        userType: 'patient',
      },
      {
        name: 'Jane Smith',
        email: 'jane@patient.com',
        password: 'password123',
        userType: 'patient',
      },
      // Add more patients as needed
    ];

    for (let patient of patientsData) {
      // Check if patient already exists
      const existing = await User.findOne({ email: patient.email });
      if (!existing) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(patient.password, salt);
        patient.password = hashedPassword;
        await User.create(patient);
        console.log(`Seeded patient: ${patient.name}`);
      } else {
        console.log(`${patient.name} already exists, skipping...`);
      }
    }

    console.log('Patient seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedPatients();
