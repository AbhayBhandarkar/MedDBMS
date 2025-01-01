import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import axios from '../api/axiosInstance';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', specialization: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/auth/profile'); // Ensure this route exists
        setUser(data);
        setForm({
          name: data.name,
          email: data.email,
          specialization: data.specialization || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const { data } = await axios.put('/doctor/profile', form); // Adjust based on userType
      setSuccess('Profile updated successfully.');
      setUser(data.doctor);
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {user && (
        <form onSubmit={handleUpdate}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
            required
            disabled
          />
          {user.userType === 'doctor' && (
            <TextField
              label="Specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
              required
            />
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 4 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </form>
      )}
    </Container>
  );
}

export default UserProfile;
