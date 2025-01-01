// server.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { GoogleGenerativeAI } from '@google/generative-ai';

import { connectDB } from './src/config/db.mjs';
import authRoutes from './src/routes/authRoutes.mjs';
import appointmentRoutes from './src/routes/appointmentRoutes.mjs';
import doctorRoutes from './src/routes/doctorRoutes.mjs';
import medicalRecordRoutes from './src/routes/medicalRecordRoutes.mjs';
import { auth } from './src/utils/auth.mjs'; // JWT middleware

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect to MongoDB
await connectDB();

// 2) Define routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// 3) Gemini API Configuration
const { GEMINI_API_KEY, PORT = 5000 } = process.env;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in .env. Chat functionality will fail.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function callGemini(prompt) {
  try {
    const response = await model.generateContent({ 
      contents: [{ role: "user", parts: [{ text: prompt }] }] 
    });
    return response.response.text();
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return 'Error in generating response.';
  }
}

// 4) Chat route
app.post('/api/chat', auth, async (req, res) => {
  if (req.user.userType !== 'patient') {
    return res.status(403).json({ msg: 'Only patients can use the chatbot.' });
  }
  const { question } = req.body;
  if (!question) return res.status(400).json({ msg: 'Question not provided.' });

  const answer = await callGemini(question);
  res.json({ answer });
});

// 5) Serve React Build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// 6) Start the Server
app.listen(PORT, () => console.log(`NeuroHelp server running on port ${PORT}`));
