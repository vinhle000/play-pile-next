import mongoose from 'mongoose';

const mongoServer =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI
    : 'mongodb://localhost:27017/playPile';

if (!mongoServer) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local',
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { connection: null, promise: null };
}

export const connectDB = async () => {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = await mongoose.connect(mongoServer);
  }
  try {
    cached.connection = await cached.promise;

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
      cached.conn = null; // Reset cached connection
    });

    return cached.connection;
  } catch (error) {
    cached.promise = null;
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
