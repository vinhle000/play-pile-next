const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {
  try {
    console.log(`MongoDB Connecting...`);
    const conn = await mongoose.connect(`mongodb://localhost:27017/playPile`);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;