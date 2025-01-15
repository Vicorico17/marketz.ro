import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Using MongoDB URI:', MONGODB_URI);

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(retries = 3) {
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
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      console.log('Connecting to MongoDB...', MONGODB_URI);
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
        .catch(async (error) => {
          console.error('Failed to connect to MongoDB:', error);
          cached.promise = null;
          
          if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return connectDB(retries - 1);
          }
          
          throw error;
        });
    } else {
      console.log('Using existing MongoDB connection promise');
    }

    try {
      cached.conn = await cached.promise;
      console.log('MongoDB connection state:', cached.conn.connection.readyState);
    } catch (e) {
      cached.promise = null;
      console.error('Error while awaiting MongoDB connection:', e);
      throw e;
    }

    return cached.conn;
  } catch (e) {
    console.error('Error in connectDB:', e);
    throw e;
  }
}

// Add event listeners for connection issues
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected event fired');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected event fired');
  cached.conn = null;
  cached.promise = null;
});

export default connectDB; 