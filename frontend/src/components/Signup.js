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
import axios from 'axios'; // Assuming you'll use axios for API calls

const APP_NAME = 'Quizzz';
const API_BASE_URL = 'http://localhost:5000'; // Your backend API base URL

const glassCardStyles = {
  px: { xs: 2, sm: 6 },
  py: { xs: 5, sm: 8 },
  borderRadius: 6,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  background: 'rgba(17, 24, 39, 0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'center',
  maxWidth: 450,
  width: '100%',
};

const gradientTextStyles = {
  fontWeight: 900,
  fontSize: { xs: '2rem', sm: '2.8rem' },
  letterSpacing: '-0.04em',
  background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 60%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  mb: 2,
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Password strength check (basic example)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      // TODO: Implement actual backend API call for signup
      console.log('Attempting to sign up user:', username);
      // Replace with actual axios.post call to your backend signup endpoint
      const response = await axios.post(`${API_BASE_URL}/api/signup`, {
         username: username,
         password: password,
      });

      // Assuming backend returns success: true on successful signup
      if (response.data.success) {
        setSuccess('Signup successful! Redirecting to login...');
        // Optionally, automatically log in the user or redirect to login
        setTimeout(() => {
            // Assuming backend sends a token or user identifier on successful signup
            localStorage.setItem('authToken', response.data.token || 'true'); // Store auth token (or a simple flag)
            navigate('/'); // Redirect to home page immediately
        }, 0); // Redirect after 0 seconds
      } else {
        // Handle potential backend errors (e.g., username already exists)
        setError(response.data.message || 'Signup failed. Please try again.');
      }

    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup. Please try again.');
    }
  };

  return (
    <Box sx={{ background: 'radial-gradient(circle at 20% 30%, #6366f1 0%, #ec4899 40%, #22d3ee 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container sx={glassCardStyles}>
        <QuizIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography component="h1" sx={gradientTextStyles}>
          Sign Up
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create your account to start quizzing!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
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
            sx={{ mb: 2 }}
          />
           <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          {error && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{error}</Typography>}
          {success && <Typography color="success.main" variant="body2" sx={{ mb: 2 }}>{success}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!username.trim() || !password.trim() || !confirmPassword.trim()}
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
            Sign Up
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link href="#" onClick={() => navigate('/login')} sx={{ color: '#6366f1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Login here
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Signup; 