const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const logger = require('./config/logger');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

const express = require('express');

const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
connectDB();
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // To allow credentials (cookies, authorization headers, etc.)
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => { // Middleware to log all requests
  // console.log('Headers:', req.body);
  // console.log('Cookies:', req.cookies);
  next();
});
app.use('/api/games/', require('./src/routes/gameRoutes'));
app.use('/api/users/', require('./src/routes/userRoutes'))
app.use('/api/userGames/', require('./src/routes/userGameRoutes'))
app.use('/api/board/columns', require('./src/routes/columnRoutes.js'))


app.listen(port, () => console.log(`Server is running on port ${port}`));
