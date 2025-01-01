// client/src/pages/Unauthorized.jsx

import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h3" gutterBottom>
          403 - Unauthorized
        </Typography>
        <Typography variant="body1" gutterBottom>
          You do not have permission to view this page. Please check your access rights or contact support if you believe this is an error.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}

export default Unauthorized;
