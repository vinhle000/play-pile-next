import mongoose from 'mongoose';

const mongoServer = (() => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'production':
      return process.env.MONGO_URI_PROD;
    case 'stage':
      return process.env.MONGO_URI_STAGE;
    case 'dev':
      return process.env.MONGO_URI_DEV;
    default:
      return 'mongodb://localhost:27017/playPile_dev_local';
  }
})();


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
    console.log('CACHED mongo connection ------>');
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
      cached.connection = null; // Reset cached connection
    });
    return cached.connection;
  } catch (error) {
    cached.promise = null;
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
