import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      const db = cached.conn.connection.db;
      if (db) {
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map((c: { name: string }) => c.name));
      }
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Connecting to MongoDB...', MONGODB_URI.split('@')[1]);
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(async (mongoose) => {
          console.log('MongoDB connected successfully');
          const db = mongoose.connection.db;
          if (db) {
            const collections = await db.listCollections().toArray();
            console.log('Available collections:', collections.map((c: { name: string }) => c.name));
          }
          return mongoose;
        })
        .catch((error) => {
          console.error('Failed to connect to MongoDB:', error);
          cached.promise = null;
          throw error;
        });
    } else {
      console.log('Using existing MongoDB connection promise');
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('Error in connectDB:', e);
    throw e;
  }
}

export default connectDB; 