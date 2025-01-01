import React from 'react'
import { Container, Typography } from '@mui/material'

function Home() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Welcome to NeuroHelp</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is a neurology-focused platform. Please login or register.
      </Typography>
    </Container>
  )
}

export default Home
