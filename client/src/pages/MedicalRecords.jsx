// src/pages/MedicalRecords.jsx
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import axios from '../api/axiosInstance';

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [newRecord, setNewRecord] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get('/medical-records');
        console.log('Fetched medical records:', data);
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (err) {
        console.error('Error fetching medical records:', err.response?.data || err.message);
        setError('Failed to load medical records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleOpen = (record) => {
    setCurrentRecord(record);
    setNewRecord(record.record);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRecord(null);
    setNewRecord('');
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`/medical-records/${currentRecord._id}`, { record: newRecord });
      setRecords((prev) =>
        prev.map((rec) =>
          rec._id === currentRecord._id ? { ...rec, record: data.medicalRecord.record } : rec
        )
      );
      alert('Medical record updated successfully!');
      handleClose();
    } catch (err) {
      console.error('Error updating medical record:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Failed to update medical record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;

    try {
      await axios.delete(`/medical-records/${id}`);
      setRecords((prev) => prev.filter((rec) => rec._id !== id));
      alert('Medical record deleted successfully!');
    } catch (err) {
      console.error('Error deleting medical record:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Failed to delete medical record.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Medical Records
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Container sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading medical records, please wait...
          </Typography>
        </Container>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table aria-label="medical records table">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Record</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No medical records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec._id}>
                    <TableCell>{rec.patient?.name || 'Unknown'}</TableCell>
                    <TableCell>{rec.doctor?.name || 'Unknown'}</TableCell>
                    <TableCell>{rec.record}</TableCell>
                    <TableCell>{new Date(rec.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{new Date(rec.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpen(rec)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(rec._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Medical Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Medical Record"
            type="text"
            fullWidth
            variant="standard"
            value={newRecord}
            onChange={(e) => setNewRecord(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MedicalRecords;
