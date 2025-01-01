// src/pages/DoctorAvailability.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from '../api/axiosInstance';

function DoctorAvailability() {
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTimeSlotChange = (index, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = value;
    setTimeSlots(newTimeSlots);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, '']);
  };

  const removeTimeSlot = (index) => {
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!date || timeSlots.some((slot) => !slot.trim())) {
      setError('Please select a date and fill in all time slots.');
      return;
    }

    try {
      setLoading(true);

      // Prepare the availability data in the expected format
      const availability = [
        {
          date: new Date(date), // Ensure date is in Date format
          slots: timeSlots,
        },
      ];

      // Send the PUT request to update availability
      const { data } = await axios.put('/doctor/availability', { availability });
      setSuccess(data.msg || 'Availability updated successfully!');
      setDate('');
      setTimeSlots(['']);
    } catch (err) {
      console.error('Error updating availability:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to update availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Availability
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
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

        {/* Time Slots */}
        {timeSlots.map((slot, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              label={`Time Slot ${index + 1}`}
              type="time"
              value={slot}
              onChange={(e) => handleTimeSlotChange(index, e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ flexGrow: 1 }}
            />
            {timeSlots.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                sx={{ ml: 2 }}
                onClick={() => removeTimeSlot(index)}
              >
                Remove
              </Button>
            )}
          </Box>
        ))}

        <Button variant="outlined" sx={{ mt: 2 }} onClick={addTimeSlot}>
          Add Time Slot
        </Button>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 4 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Availability'}
        </Button>
      </form>
    </Container>
  );
}

export default DoctorAvailability;
