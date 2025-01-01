// src/models/userModel.mjs
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['patient', 'doctor'], required: true },
    specialization: { type: String }, // Optional, for doctors
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: {
          type: [String],
          required: true,
          validate: {
            validator: function (slots) {
              // Adjust the regex according to your time format
              return slots.every((slot) => /^\d{2}:\d{2}$/.test(slot));
            },
            message: 'Each slot must match the format "HH:MM".',
          },
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Virtual field example
userSchema.virtual('fullInfo').get(function () {
  return `${this.name} (${this.userType})`;
});

export default mongoose.model('User', userSchema);
