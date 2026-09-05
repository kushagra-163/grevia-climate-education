import mongoose from 'mongoose';
import { env } from './env';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected to MongoDB at ${env.MONGO_URI}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB (${env.MONGO_URI}). Launching in-memory MongoDB fallback for runnable MVP...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory Fallback MongoDB at ${memUri}`);
    } catch (memError) {
      console.error('[Database] Critical: In-Memory MongoDB Fallback failed:', memError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
