// client/src/pages/SegmentImage.jsx
import React, { useState } from 'react';
import { Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import axios from '../api/axiosInstance';

function SegmentImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [segmentedImage, setSegmentedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setSegmentedImage(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      const { data } = await axios.post('/segment-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSegmentedImage(data.segmentedImage); // Assuming the server returns a URL or base64 string
      setLoading(false);
    } catch (err) {
      console.error('Error segmenting image:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to segment image.');
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Segment Brain Image</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Button variant="contained" component="span" sx={{ mt: 2 }}>
          Choose Image
        </Button>
      </label>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleUpload}
        disabled={!selectedFile || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Segment Image'}
      </Button>

      {segmentedImage && (
        <div sx={{ mt: 4 }}>
          <Typography variant="h6">Segmented Image:</Typography>
          <img src={segmentedImage} alt="Segmented" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </Container>
  );
}

export default SegmentImage;
