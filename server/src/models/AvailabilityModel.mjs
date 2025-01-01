import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlots: [{ type: String, required: true }], // e.g., ["10:00 AM - 11:00 AM", "1:00 PM - 2:00 PM"]
  },
  { timestamps: true }
);

export default mongoose.model('Availability', availabilitySchema);
