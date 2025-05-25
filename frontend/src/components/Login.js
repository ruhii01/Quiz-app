import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Stack,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import axios from 'axios';

const APP_NAME = 'Quizzz';
const API_BASE_URL = 'http://localhost:5000';

const glassCard = {
  px: { xs: 1, sm: 5 },
  py: { xs: 4, sm: 7 },
  borderRadius: 6,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  background: 'rgba(17, 24, 39, 0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'center',
  maxWidth: 450,
  width: '100%',
};

const gradientText = {
  fontWeight: 900,
  fontSize: { xs: '2rem', sm: '2.8rem' },
  letterSpacing: '-0.04em',
  background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 60%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  mb: 1,
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError('Username cannot be empty.');
      console.log('DEBUG: Username is empty.');
      return;
    }

    try {
      console.log(`DEBUG: Checking existence for username: ${trimmedUsername}`);
      const response = await axios.get(`${API_BASE_URL}/api/user/exists/${trimmedUsername}`);

      console.log('DEBUG: Backend response:', response.data);

      if (response.data.exists) {
        // Username exists, show error and prevent login
        setError('Username already taken. Please choose another.');
        console.log('DEBUG: Username exists, showing error.');
      } else {
        // Username is unique, proceed to login
        localStorage.setItem('authToken', response.data.token || 'true');
        setError('');
        console.log('DEBUG: Username is unique, logging in.');
        navigate('/');
      }
    } catch (err) {
      console.error('Error checking username existence:', err);
      setError('An error occurred. Please try again.');
      console.log('DEBUG: Error during existence check.', err);
    }
  };

  return (
    <Box sx={{ background: 'radial-gradient(circle at 20% 30%, #6366f1 0%, #ec4899 40%, #22d3ee 100%)' }}>
      <Container sx={glassCard}>
        <QuizIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography component="h1" sx={gradientText}>
          {APP_NAME}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please enter your username to start the quiz
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            variant="outlined"
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!username.trim() || !password.trim()}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 90%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(99,102,241,0.15)',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #6366f1 0%, #22d3ee 100%)',
                transform: 'translateY(-2px) scale(1.04)',
                boxShadow: '0 8px 32px 0 rgba(99,102,241,0.25)',
              },
            }}
          >
            Start Quiz
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Don't have an account?{' '}
          <Link href="#" onClick={() => navigate('/signup')} sx={{ color: '#6366f1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Sign up here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login; 