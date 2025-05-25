import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';

const gradientText = {
  fontWeight: 900,
  fontSize: { xs: '1.5rem', sm: '2.2rem' },
  letterSpacing: '-0.04em',
  background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 60%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  cursor: 'pointer',
  flexGrow: 1,
  ml: { xs: 0, sm: 1 },
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const authToken = localStorage.getItem('authToken'); // Get auth token from local storage

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove auth token from local storage
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: 'rgba(17,24,39,0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      py: { xs: 0.2, sm: 0.5 },
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 40, sm: 56 }, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <QuizIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: 'primary.main' }} />
            <Typography
              component="div"
              sx={gradientText}
            >
              Quizzz
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 0.8, sm: 1.5 }, alignItems: 'center' }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: isActive('/') ? 700 : 400,
                color: isActive('/') ? 'primary.main' : 'white',
                borderBottom: isActive('/') ? '2px solid #6366f1' : 'none',
                borderRadius: 0,
                px: { xs: 0.8, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#ec4899',
                  background: 'rgba(236, 72, 153, 0.1)',
                },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/quiz')}
              sx={{
                fontWeight: isActive('/quiz') ? 700 : 400,
                color: isActive('/quiz') ? 'primary.main' : 'white',
                borderBottom: isActive('/quiz') ? '2px solid #6366f1' : 'none',
                borderRadius: 0,
                px: { xs: 0.8, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#ec4899',
                  background: 'rgba(236, 72, 153, 0.1)',
                },
              }}
            >
              Quiz
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/leaderboard')}
              sx={{
                fontWeight: isActive('/leaderboard') ? 700 : 400,
                color: isActive('/leaderboard') ? 'primary.main' : 'white',
                borderBottom: isActive('/leaderboard') ? '2px solid #6366f1' : 'none',
                borderRadius: 0,
                px: { xs: 0.8, sm: 1.5 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#ec4899',
                  background: 'rgba(236, 72, 153, 0.1)',
                },
              }}
            >
              Leaderboard
            </Button>
            {!authToken && ( // Show Login and Signup when not logged in
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    fontWeight: isActive('/login') ? 700 : 400,
                    color: isActive('/login') ? 'primary.main' : 'white',
                    borderBottom: isActive('/login') ? '2px solid #6366f1' : 'none',
                    borderRadius: 0,
                    px: { xs: 0.8, sm: 1.5 },
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: '#ec4899',
                      background: 'rgba(236, 72, 153, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/signup')}
                  sx={{
                    fontWeight: isActive('/signup') ? 700 : 400,
                    color: isActive('/signup') ? 'primary.main' : 'white',
                    borderBottom: isActive('/signup') ? '2px solid #6366f1' : 'none',
                    borderRadius: 0,
                    px: { xs: 0.8, sm: 1.5 },
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: '#ec4899',
                      background: 'rgba(236, 72, 153, 0.1)',
                    },
                  }}
                >
                  Signup
                </Button>
              </>
            )}
            {authToken && ( // Conditionally render logout button
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  fontWeight: 400,
                   color: 'white',
                  borderRadius: 0,
                  px: { xs: 0.8, sm: 1.5 },
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#ec4899',
                    background: 'rgba(236, 72, 153, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 