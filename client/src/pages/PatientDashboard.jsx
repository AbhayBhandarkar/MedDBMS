// client/src/pages/PatientDashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from '../api/axiosInstance';
import { format } from 'date-fns';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/appointments');
        console.log('Fetched Appointments:', data); // Debugging log
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err.response?.data || err.message);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Appointments
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="appointments table">
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt) => (
                  <TableRow key={appt._id}>
                    {/* Safely access doctor properties */}
                    <TableCell>
                      {appt.doctor && appt.doctor.name ? appt.doctor.name : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {appt.doctor && appt.doctor.specialization
                        ? appt.doctor.specialization
                        : 'General Neurology'}
                    </TableCell>
                    <TableCell>{format(new Date(appt.date), 'PPP')}</TableCell>
                    <TableCell>{appt.timeSlot}</TableCell>
                    <TableCell>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default PatientDashboard;
