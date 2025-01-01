// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, CircularProgress,
  Alert
} from '@mui/material';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setError('');

      try {
        const { data } = await axios.get('/auth/doctors');
        console.log('Fetched doctors:', data);
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err.response?.data || err.message);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!doctorId || !date || !timeSlot) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setBooking(true);
      const { data } = await axios.post('/appointments/book', { doctorId, date, timeSlot });
      alert(data.msg || 'Appointment booked successfully!');
      navigate('/patient/dashboard');
    } catch (err) {
      console.error('Error booking appointment:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to book appointment.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Book Appointment
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Doctor Select */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
          {loadingDoctors ? (
            <CircularProgress size={24} sx={{ mt: 2, mb: 2 }} />
          ) : (
            <Select
              labelId="doctor-select-label"
              id="doctorSelect"
              label="Select Doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              {doctors.length === 0 ? (
                <MenuItem disabled>No doctors found</MenuItem>
              ) : (
                doctors.map((doc) => (
                  <MenuItem key={doc._id} value={doc._id}>
                    {doc.name} ({doc.specialization || 'General Neurology'})
                  </MenuItem>
                ))
              )}
            </Select>
          )}
        </FormControl>

        {/* Date */}
        <TextField
          label="Date"
          type="date"
          fullWidth
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Time Slot */}
        <TextField
          label="Time Slot"
          type="time"
          fullWidth
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4 }}
          disabled={booking}
        >
          {booking ? <CircularProgress size={24} /> : 'Book'}
        </Button>
      </form>
    </Container>
  );
}

export default BookAppointment;
