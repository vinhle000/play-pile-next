import mongoose from 'mongoose';

const mongoServer =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI
    : 'mongodb://localhost:27017/playPile';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    console.log(`MongoDB Connecting...`);
    const conn = await mongoose.connect(mongoServer, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
};
