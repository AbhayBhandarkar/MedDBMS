import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import axios from '../api/axiosInstance';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) {
      alert('Please enter a question.');
      return;
    }

    // Add user's message to local state
    const userMsg = { role: 'patient', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);
      setError('');
      console.log('Sending question:', input); // Debugging log
      const { data } = await axios.post('/chat', { question: input });
      const botMsg = { role: 'bot', text: data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error details:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Unknown error');
      alert('Chat error: ' + (err.response?.data?.msg || 'Unknown error'));
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        NeuroHelp Chatbot
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          p: 2,
          mt: 2,
          height: 400,
          overflowY: 'auto',
        }}
      >
        {messages.map((m, i) => (
          <Typography
            key={i}
            sx={{ color: m.role === 'bot' ? 'green' : 'blue', mb: 1 }}
          >
            <strong>{m.role.toUpperCase()}:</strong> {m.text}
          </Typography>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography sx={{ color: 'gray' }}>Bot is typing...</Typography>
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        label="Ask something about neurology..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{ mt: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSend}
        disabled={!input.trim() || loading}
      >
        Send
      </Button>
    </Container>
  );
}

export default Chatbot;
