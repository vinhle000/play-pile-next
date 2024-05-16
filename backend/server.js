require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger'); // Assuming you have a custom logger set up
const connectDB = require('./config/db'); // Your database connection file

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:5173',
  credentials: true, // This allows cookies to be sent with requests
};

// Content Security Policy (CSP) Configuration
const csp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  },
});

// Middleware
app.use(csp);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Logging middleware to log all requests
app.use((req, res, next) => {
  if (req.body) {
    logger.info(`Request Body -----> ${JSON.stringify(req.body)}`);
  }
  next();
});

// Define routes
app.use('/api/games/', require('./src/routes/gameRoutes'));
app.use('/api/users/', require('./src/routes/userRoutes'));
app.use('/api/userGames/', require('./src/routes/userGameRoutes'));
app.use('/api/board/columns', require('./src/routes/columnRoutes.js'));

// Root route for testing if the server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}`));
