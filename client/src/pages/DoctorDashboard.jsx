// src/pages/DoctorDashboard.jsx
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
  Button,
} from '@mui/material';
import axios from '../api/axiosInstance';
import { format } from 'date-fns';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get('/appointments');
        console.log('Fetched appointments:', data);
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err.response?.data || err.message);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/appointments/${appointmentId}`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      alert('Appointment status updated successfully!');
    } catch (err) {
      console.error('Error updating appointment status:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Failed to update appointment status.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Doctor Dashboard - Appointments
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Container sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading appointments, please wait...
          </Typography>
        </Container>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table aria-label="appointments table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No appointments found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt) => (
                  <TableRow key={appt._id}>
                    <TableCell>{appt.patient?.name || 'Unknown'}</TableCell>
                    <TableCell>{appt.patient?.email || 'No email'}</TableCell>
                    <TableCell>{format(new Date(appt.date), 'PPP')}</TableCell>
                    <TableCell>{appt.timeSlot}</TableCell>
                    <TableCell>
                      {appt.status
                        ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1)
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {appt.status === 'pending' ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
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

export default DoctorDashboard;
