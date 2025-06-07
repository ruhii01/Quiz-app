import React from 'react';
import { Box, Typography, Button, Container, Stack, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';

const APP_NAME = 'MindTrek';

const gradientBg = {
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'radial-gradient(circle at 20% 30%, #6366f1 0%, #ec4899 40%, #22d3ee 100%)',
  position: 'relative',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
};

const glassCard = {
  px: { xs: 2, sm: 8 },
  py: { xs: 6, sm: 10 },
  borderRadius: 6,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  background: 'rgba(17, 24, 39, 0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'center',
  maxWidth: 700,
  width: '100%',
};

const gradientText = {
  fontWeight: 900,
  fontSize: { xs: '2.5rem', sm: '4rem', md: '5rem' },
  letterSpacing: '-0.04em',
  lineHeight: 1.1,
  background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 60%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  mb: 2,
};

const featureCard = {
  p: 3,
  height: '100%',
  background: 'rgba(17, 24, 39, 0.6)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(17, 24, 39, 0.8)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
};

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QuizIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
      title: 'Interactive Quiz',
      description: 'Challenge yourself with carefully crafted questions covering various topics.',
    },
    {
      icon: <TimerIcon sx={{ fontSize: 40, color: '#ec4899' }} />,
      title: 'Time Challenge',
      description: 'Test your knowledge under pressure with our timed questions.',
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: '#22d3ee' }} />,
      title: 'Streak System',
      description: 'Build your streak by answering questions correctly in sequence.',
    },
    {
      icon: <HelpOutlineIcon sx={{ fontSize: 40, color: '#6366f1' }} />,
      title: 'Smart Hints',
      description: 'Get helpful hints when you\'re stuck on a question.',
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#ec4899' }} />,
      title: 'Leaderboard',
      description: 'Compete with others and see your ranking on the global leaderboard.',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#22d3ee' }} />,
      title: 'Performance Reports',
      description: 'Get detailed insights into your quiz performance and areas for improvement.',
    },
  ];

  return (
    <Box sx={gradientBg}>
      <Container sx={{ 
        px: { xs: 1, sm: 6 },
        py: { xs: 4, sm: 8 },
        borderRadius: 6,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        maxWidth: 700,
        width: '100%',
        mb: 4,
      }}>
        <Typography component="h1" sx={gradientText}>
          {APP_NAME}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
          Built to challenge your mind. Compete, learn, and climb the leaderboard!
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              py: 1.8,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 90%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(99,102,241,0.15)',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #6366f1 0%, #22d3ee 100%)',
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 12px 35px rgba(99,102,241,0.4)',
              },
            }}
            onClick={() => navigate('/quiz')}
          >
            Start Quiz
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              px: 5,
              py: 1.8,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 3,
              color: '#fff',
              border: '2px solid #6366f1',
              background: 'rgba(99,102,241,0.08)',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'rgba(99,102,241,0.18)',
                borderColor: '#ec4899',
                color: '#ec4899',
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: '0 12px 35px rgba(99,102,241,0.2)',
              },
            }}
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </Button>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ 
          color: 'white', 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 60%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={featureCard}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 4, opacity: 0.7 }}>
        © {new Date().getFullYear()} MindTrek. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Home; 
 