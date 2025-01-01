import React from 'react';
import { Alert, Container, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error Boundary Caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">
            <Typography variant="h6">Something went wrong.</Typography>
            <Typography variant="body1">{this.state.error?.toString()}</Typography>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
