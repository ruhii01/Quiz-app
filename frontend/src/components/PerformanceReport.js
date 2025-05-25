import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useTheme } from '@mui/material/styles';

const PerformanceReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { score, totalQuestions, results } = location.state || {};

  if (!results) {
    return (
      <Box>
        <Typography variant="h5" color="error" sx={{ textAlign: 'center', mt: 4 }}>
          No performance data available.
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
           <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ ...theme.typography.h4, textAlign: 'center', mb: 3 }}>
            Performance Report
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Your Score: {score} out of {totalQuestions}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Question Breakdown:
          </Typography>

          <List>
            {results.map((result, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, background: theme.palette.background.default, border: result.isCorrect ? '1px solid' + theme.palette.success.main : '1px solid' + theme.palette.error.main }}>
                <CardContent sx={{ p: '8px !important' }}>
                <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: '32px', mt: '4px' }}>
                    {result.isCorrect ? (
                      <CheckCircleOutlineIcon color="success" />
                    ) : (
                      <CancelOutlinedIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Question {index + 1}: {result.question}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Your Answer: {result.selectedOption || 'Not answered'}
                        </Typography>
                        {!result.isCorrect && (
                          <Typography variant="body2" color="error">
                            Correct Answer: {result.correctAnswer}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                </CardContent>
              </Card>
            ))}
          </List>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PerformanceReport; 