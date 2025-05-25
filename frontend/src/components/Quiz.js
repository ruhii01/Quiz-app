import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StarIcon from '@mui/icons-material/Star';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const API_BASE_URL = 'http://localhost:5000';
const QUESTION_TIME = 30; // seconds per question

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showTimer, setShowTimer] = useState(true);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }
    fetchQuestions();
  }, [navigate]);

  useEffect(() => {
    if (showTimer && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleNext();
            return QUESTION_TIME;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, showTimer, showResults]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/questions`);
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch questions. Please try again later.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: event.target.value,
    });
    setShowHint(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(QUESTION_TIME);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(QUESTION_TIME);
      setShowHint(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId) + 1,
        selectedOption,
      }));

      const response = await axios.post(`${API_BASE_URL}/api/submit`, {
        answers: formattedAnswers,
        playerName: localStorage.getItem('username'),
      });

      // Navigate to performance report page with results
      navigate('/report', { state: response.data });

    } catch (err) {
      setError('Failed to submit answers. Please try again.');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // The results display logic is moved to PerformanceReport.js
  // This component will now navigate to the report page on submit

  return (
    <Zoom in={true}>
      <Card sx={{ mt: 0,
        maxWidth: 800,
        mx: 'auto',
        px: { xs: 1, sm: 3 },
        py: { xs: 2, sm: 4 },
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">
                Question {currentQuestion + 1} of {questions.length}
              </Typography>
              <Badge badgeContent={streak} color="secondary" showZero>
                <StarIcon color="secondary" />
              </Badge>
            </Box>
            {showTimer && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimerIcon sx={{ mr: 1, color: timeLeft <= 10 ? 'error.main' : 'primary.main' }} />
                <Typography
                  variant="h6"
                  sx={{ color: timeLeft <= 10 ? 'error.main' : 'inherit' }}
                >
                  {timeLeft}s
                </Typography>
              </Box>
            )}
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 3, height: 8, borderRadius: 4 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {questions[currentQuestion]?.question}
            </Typography>
            <Tooltip title="Show Hint">
              <IconButton
                onClick={() => setShowHint(!showHint)}
                sx={{ ml: 1 }}
                size="small"
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            {showHint && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Hint: {questions[currentQuestion]?.hint || "No hint available"}
              </Typography>
            )}
          </Box>

          <RadioGroup
            value={answers[currentQuestion] || ''}
            onChange={handleAnswerChange}
          >
            {questions[currentQuestion]?.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              />
            ))}
          </RadioGroup>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default Quiz; 