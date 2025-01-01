// client/src/pages/ViewAppointments.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert
} from '@mui/material';
import axios from '../api/axiosInstance';
import { format } from 'date-fns';

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/appointments');
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
        {localStorage.getItem('userType') === 'patient' ? 'My' : 'All'} Appointments
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="appointments table">
            <TableHead>
              <TableRow>
                {localStorage.getItem('userType') === 'doctor' && (
                  <>
                    <TableCell>Patient</TableCell>
                    <TableCell>Email</TableCell>
                  </>
                )}
                {localStorage.getItem('userType') === 'patient' && (
                  <>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Specialization</TableCell>
                  </>
                )}
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Status</TableCell>
                {localStorage.getItem('userType') === 'doctor' && (
                  <TableCell>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={localStorage.getItem('userType') === 'doctor' ? 6 : 5} align="center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt) => (
                  <TableRow key={appt._id}>
                    {localStorage.getItem('userType') === 'doctor' && (
                      <>
                        <TableCell>{appt.patient.name}</TableCell>
                        <TableCell>{appt.patient.email}</TableCell>
                      </>
                    )}
                    {localStorage.getItem('userType') === 'patient' && (
                      <>
                        <TableCell>{appt.doctor.name}</TableCell>
                        <TableCell>{appt.doctor.specialization || 'General Neurology'}</TableCell>
                      </>
                    )}
                    <TableCell>{format(new Date(appt.date), 'PPP')}</TableCell>
                    <TableCell>{appt.timeSlot}</TableCell>
                    <TableCell>{appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}</TableCell>
                    {localStorage.getItem('userType') === 'doctor' && (
                      <TableCell>
                        {appt.status === 'pending' && (
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
                        )}
                        {appt.status !== 'pending' && <Typography variant="body2">-</Typography>}
                      </TableCell>
                    )}
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

export default ViewAppointments;
