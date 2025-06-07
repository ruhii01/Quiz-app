const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { MONGODB_URI, DB_NAME, MONGODB_OPTIONS } = require('./config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware
app.use(express.json());

// Import Score model
const Score = require('./models/Score');
const User = require('./models/User');

// Sample quiz questions
const questions = [
  {
    id: 1,
    question: "Which programming language was created by Brendan Eich in 1995?",
    options: ["Python", "Java", "JavaScript", "PHP"],
    correctAnswer: "JavaScript",
    hint: "It was originally created for Netscape browser.",
  },
  {
    id: 2,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Color Style Syntax"],
    correctAnswer: "Cascading Style Sheets",
    hint: "It's used for styling web pages.",
  },
  {
    id: 3,
    question: "Which of these is NOT a JavaScript framework?",
    options: ["Angular", "Django", "Vue", "React"],
    correctAnswer: "Django",
    hint: "This one is a Python framework.",
  },
  {
    id: 4,
    question: "What is the purpose of SQL?",
    options: ["Styling web pages", "Database management", "Server configuration", "Image processing"],
    correctAnswer: "Database management",
    hint: "It's used to interact with relational databases.",
  },
  {
    id: 5,
    question: "Which protocol is used for secure data transfer over the web?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctAnswer: "HTTPS",
    hint: "It's the encrypted version of HTTP.",
  },
  {
    id: 6,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Program Integration", "Automated Processing Interface", "Application Process Integration"],
    correctAnswer: "Application Programming Interface",
    hint: "It's how different software components communicate.",
  },
  {
    id: 7,
    question: "Which of these is a version control system?",
    options: ["Docker", "Jenkins", "Git", "Kubernetes"],
    correctAnswer: "Git",
    hint: "Created by Linus Torvalds for Linux development.",
  },
  {
    id: 8,
    question: "What is Node.js?",
    options: ["Web browser", "Runtime environment", "Database system", "Operating system"],
    correctAnswer: "Runtime environment",
    hint: "It allows JavaScript to run outside the browser.",
  },
  {
    id: 9,
    question: "Which company developed React.js?",
    options: ["Google", "Microsoft", "Facebook", "Amazon"],
    correctAnswer: "Facebook",
    hint: "Now known as Meta.",
  },
  {
    id: 10,
    question: "What is MongoDB classified as?",
    options: ["SQL Database", "NoSQL Database", "File System", "Web Server"],
    correctAnswer: "NoSQL Database",
    hint: "It stores data in JSON-like documents.",
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

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(username).toString('base64');

    res.status(200).json({
      message: 'Login successful.',
      username: user.username,
      token: token
    });

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

// Add this route before startServer(PORT)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username -_id');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Add this route before startServer(PORT)
app.delete('/api/users/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    console.log('All users cleared');
    res.status(200).json({ message: 'All users cleared successfully' });
  } catch (error) {
    console.error('Error clearing users:', error);
    res.status(500).json({ message: 'Error clearing users' });
  }
});

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      ...MONGODB_OPTIONS,
      dbName: DB_NAME
    });
    console.log('Successfully connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection
connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry();
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
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