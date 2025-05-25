import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

const API_BASE_URL = 'http://localhost:5000';

const glassCard = {
  px: { xs: 1, sm: 4 },
  py: { xs: 3, sm: 5 },
  borderRadius: 6,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  background: 'rgba(17, 24, 39, 0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
  maxWidth: 700,
  width: '100%',
  mx: 'auto',
  mt: 0,
};

const gradientText = {
  fontWeight: 900,
  fontSize: { xs: '2rem', sm: '2.8rem' },
  letterSpacing: '-0.04em',
  background: 'linear-gradient(90deg, #6366f1 10%, #ec4899 60%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  mb: 2,
  textAlign: 'center',
  mt: 0,
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leaderboard`);
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch leaderboard. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{
      px: { xs: 1, sm: 4 },
      py: { xs: 3, sm: 5 },
      borderRadius: 6,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      background: 'rgba(17, 24, 39, 0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      maxWidth: 700,
      width: '100%',
      mx: 'auto',
      mt: 0,
    }}>
      <Typography s={{...gradientText, mt: 2}}>Leaderboard</Typography>
      <TableContainer component={Paper} sx={{ background: 'rgba(30,41,59,0.85)', borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#818cf8', fontWeight: 700 }}>Rank</TableCell>
              <TableCell sx={{ color: '#818cf8', fontWeight: 700 }}>Player</TableCell>
              <TableCell align="right" sx={{ color: '#818cf8', fontWeight: 700 }}>Score</TableCell>
              <TableCell align="right" sx={{ color: '#818cf8', fontWeight: 700 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <TableRow key={entry._id} sx={{ '&:hover': { background: 'rgba(99,102,241,0.08)' } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.playerName}</TableCell>
                <TableCell align="right">
                  {entry.score}/{entry.totalQuestions}
                </TableCell>
                <TableCell align="right">
                  {new Date(entry.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaderboard; 