// seeddoctors.mjs
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/userModel.mjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/neurohelpdb';

async function seedDoctors() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding doctors...');

    // Create some example doctors
    const doctorsData = [
      {
        name: 'Dr. Stephen Strange',
        email: 'strange@neurohelp.com',
        password: '123456',
        userType: 'doctor',
        specialization: 'Neurology',
      },
      {
        name: 'Dr. Wanda Maximoff',
        email: 'wanda@neurohelp.com',
        password: '123456',
        userType: 'doctor',
        specialization: 'Neurosurgery',
      },
      {
        name: 'Dr. Carol Danvers',
        email: 'carol@neurohelp.com',
        password: '123456',
        userType: 'doctor',
        specialization: 'Pediatric Neurology',
      },
    ];

    for (let doc of doctorsData) {
      // Check if doctor already exists
      const existing = await User.findOne({ email: doc.email });
      if (!existing) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(doc.password, salt);
        doc.password = hashedPassword;
        await User.create(doc);
        console.log(`Seeded doctor: ${doc.name}`);
      } else {
        console.log(`${doc.name} already exists, skipping...`);
      }
    }

    console.log('Doctor seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDoctors();
