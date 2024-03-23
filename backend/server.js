const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const logger = require('./config/logger');

const express = require('express');

const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// app.use(errorHandler);

app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('API is running');
// })
app.use('/api/games/', require('./src/routes/gameRoutes'));
app.use('/api/users/', require('./src/routes/userRoutes'))

app.listen(port, () => console.log(`Server is running on port ${port}`));