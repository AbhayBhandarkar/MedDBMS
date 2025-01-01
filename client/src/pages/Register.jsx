import React, { useState } from 'react'
import {
  Container, TextField, Button,
  Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axiosInstance'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('patient')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/auth/register', { name, email, password, userType })
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Registration failed')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Register at NeuroHelp</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="userTypeLabel">User Type</InputLabel>
          <Select
            labelId="userTypeLabel"
            label="User Type"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Container>
  )
}

export default Register
