// src/models/medicalRecordModel.mjs
import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    record: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('MedicalRecord', medicalRecordSchema);
