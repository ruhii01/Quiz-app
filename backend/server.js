const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/quizapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Import Score model
const Score = require('./models/Score');
const User = require('./models/User');

// Sample quiz questions
const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    hint: "It's known as the City of Love.",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    hint: "It's the fourth planet from the Sun.",
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    hint: "Think about simple addition.",
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    hint: "He was also an inventor and scientist.",
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
    hint: "It covers more area than all of Earth's land combined.",
  },
  {
    id: 6,
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: "JavaScript",
    hint: "It runs in your browser.",
  },
  {
    id: 7,
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au",
    hint: "It comes from the Latin word 'aurum'.",
  },
  {
    id: 8,
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctAnswer: "Australia",
    hint: "It's a continent and a country.",
  },
  {
    id: 9,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
    hint: "It lives in the ocean and is huge.",
  },
  {
    id: 10,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: "William Shakespeare",
    hint: "He is England's national poet.",
  }
];

// Routes
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.post('/api/submit', async (req, res) => {
  const { answers, playerName } = req.body;
  let score = 0;
  const results = [];
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const isCorrect = question.correctAnswer === answer.selectedOption;
      if (isCorrect) {
        score++;
      }
      results.push({
        question: question.question,
        selectedOption: answer.selectedOption,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }
  });

  // Save or update score to database (keep highest score for a player)
  try {
    const existingScore = await Score.findOne({ playerName });

    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.totalQuestions = questions.length;
        existingScore.date = new Date(); // Update timestamp
        await existingScore.save();
        console.log(`Updated score for ${playerName}`);
      } else {
        console.log(`New score for ${playerName} is not higher than existing. Not saving.`);
      }
    } else {
      const newScore = new Score({
        playerName,
        score,
        totalQuestions: questions.length
      });
      await newScore.save();
      console.log(`Saved new score for ${playerName}`);
    }

  } catch (error) {
    console.error('Error saving or updating score:', error);
  }

  res.json({ score, totalQuestions: questions.length, results });
});

// Leaderboard routes
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1, date: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Route to clear leaderboard (for admin/testing)
app.delete('/api/leaderboard/clear', async (req, res) => {
  try {
    await Score.deleteMany({});
    console.log('Leaderboard cleared');
    res.status(200).json({ message: 'Leaderboard cleared successfully' });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    res.status(500).json({ message: 'Error clearing leaderboard' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // TODO: Implement token generation and sending to frontend
    // For now, we'll just send a success message and the username
    res.status(200).json({ message: 'Login successful.', username: user.username /*, token: 'your_auth_token'*/ });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Endpoint to check if a username exists in scores
app.get('/api/user/exists/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const existingUser = await User.findOne({ username });
    res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    console.error('Error checking username existence:', error);
    res.status(500).json({ message: 'Error checking username existence' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'An error occurred during signup.' });
  }
});

// Start server with port fallback
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Error starting server:', error);
    }
  }
};

startServer(PORT); 