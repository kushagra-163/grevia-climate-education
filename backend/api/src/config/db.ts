import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    // Use public DNS servers for MongoDB Atlas SRV resolution.
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    mongoose.set('strictQuery', true);

    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    // Never log the MongoDB URI because it contains credentials.
    console.log('[Database] Connected to MongoDB Atlas');
  } catch (error) {
    console.error('[Database] Primary MongoDB connection error:');

    // Log only the error message, not the full stack or connection URI.
    console.error(
      error instanceof Error ? error.message : 'Unknown database error'
    );

    console.warn(
      '[Database] Could not connect to primary MongoDB. ' +
        'Launching in-memory MongoDB fallback for runnable MVP...'
    );

    try {
      mongoMemoryServer = await MongoMemoryServer.create();

      const memUri = mongoMemoryServer.getUri();

      await mongoose.connect(memUri);

      console.log(
        '[Database] Connected to In-Memory Fallback MongoDB'
      );
    } catch (memError) {
      console.error(
        '[Database] Critical: In-Memory MongoDB Fallback failed:',
        memError instanceof Error
          ? memError.message
          : 'Unknown fallback database error'
      );

      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }

    console.log('[Database] MongoDB connection closed.');
  } catch (error) {
    console.error(
      '[Database] Error while disconnecting:',
      error instanceof Error ? error.message : 'Unknown database error'
    );
  }
};