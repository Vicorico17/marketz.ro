import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(retries = 3) {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  try {
    if (cached.conn) {
      const db = cached.conn.connection.db;
      if (db) {
        const collections = await db.listCollections().toArray();
        console.log('MongoDB collections:', collections.map((c: { name: string }) => c.name));
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

      cached.promise = mongoose.connect(mongodbUri, opts)
        .then(async (mongoose) => {
          console.log('MongoDB connected successfully');
          const db = mongoose.connection.db;
          if (db) {
            const collections = await db.listCollections().toArray();
            console.log('MongoDB collections:', collections.map((c: { name: string }) => c.name));
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
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      console.error('Error while awaiting MongoDB connection:', e);
      throw e;
    }

    return cached.conn;
  } catch (e) {
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
