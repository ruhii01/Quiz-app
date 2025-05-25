import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import Quiz from './components/Quiz';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import PerformanceReport from './components/PerformanceReport';
import Signup from './components/Signup';
import theme from './theme';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    // Attempt to remove any default body margin/padding
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#111827'; // Ensure body background matches theme
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        html: {
          margin: 0,
          padding: 0,
        },
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#111827', // Also ensure body background matches theme
        },
      }} />
      <Router>
        <Navbar />
        <Box sx={{ flexGrow: 1, pt: { xs: '70px', sm: '85px' }, pb: 4, m: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/report" element={<PerformanceReport />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 