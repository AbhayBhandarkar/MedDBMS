import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          NeuroHelp
        </Typography>
        {token ? (
          <Box>
            {userType === 'patient' && (
              <>
                <Button color="inherit" component={Link} to="/patient/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/patient/book">
                  Book Appointment
                </Button>
                <Button color="inherit" component={Link} to="/patient/chat">
                  Chatbot
                </Button>
              </>
            )}
            {userType === 'doctor' && (
              <>
                <Button color="inherit" component={Link} to="/doctor/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/doctor/segment">
                  Segment Image
                </Button>
                <Button color="inherit" component={Link} to="/doctor/availability">
                  Availability
                </Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
