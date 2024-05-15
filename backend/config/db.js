const mongoose = require('mongoose');
require('colors');

const connectDB = async () => {

  const mongoServer = process.env.NODE_ENV === 'production' ?
  process.env.MONGO_URI : "mongodb://localhost:27017/playPile";

  try {
    console.log(`MongoDB Connecting...`);
    const conn = await mongoose.connect(mongoServer);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;