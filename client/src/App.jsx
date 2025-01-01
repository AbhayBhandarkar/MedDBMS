// client/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import ViewAppointments from './pages/ViewAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import SegmentImage from './pages/SegmentImage';
import Chatbot from './pages/Chatbot';
import UserProfile from './pages/UserProfile';
import DoctorAvailability from './pages/DoctorAvailability';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <>
      {/* Common top-level Navbar */}
      <Navbar />

      {/* Error Boundary wraps the Routes */}
      <ErrorBoundary>
        {/* Define all routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes for Patients */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book"
            element={
              <ProtectedRoute requiredRole="patient">
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute requiredRole="patient">
                <ViewAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/chat"
            element={
              <ProtectedRoute requiredRole="patient">
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute requiredRole="patient">
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected routes for Doctors */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute requiredRole="doctor">
                <ViewAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/segment"
            element={
              <ProtectedRoute requiredRole="doctor">
                <SegmentImage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute requiredRole="doctor">
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Access Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback - Redirect any undefined route to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
