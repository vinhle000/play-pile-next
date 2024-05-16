const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

const express = require('express');

const connectDB = require('./config/db');
const port = process.env.PORT || 3000;
connectDB();


const corsOptions = {
  origin: '*', // Allow requests from any origin
  // origin: process.env.NODE_ENV === 'production' ?  process.env.CLIENT_URL  : 'http://localhost:5173', // Your frontend origin
  credentials: true, // To allow credentials (cookies, authorization headers, etc.)

};
const helmet = require('helmet');

// Configure CSP
const csp = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  },
});


const app = express();
app.use(csp);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => { // Middleware to log all requests
  // console.log('Headers:', req.body);
  // console.log('Cookies:', req.cookies);
  if (req.body) {
    logger.info(`Request Body -----> ${JSON.stringify(req.body)}`);
  }
  next();
});
app.use('/api/games/', require('./src/routes/gameRoutes'));
app.use('/api/users/', require('./src/routes/userRoutes'))
app.use('/api/userGames/', require('./src/routes/userGameRoutes'))
app.use('/api/board/columns', require('./src/routes/columnRoutes.js'))


// Root route for testing if the server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server and bind to host 0.0.0.0
app.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}`));
