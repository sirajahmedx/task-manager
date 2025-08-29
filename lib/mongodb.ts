import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/taskmanager';

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI. Define it in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

let cache = global._mongooseCache;

if (!cache) {
  cache = global._mongooseCache = { conn: null, promise: null };
}

const dbConnect = async (): Promise<typeof mongoose> => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const options = { bufferCommands: false };
    cache.promise = mongoose.connect(MONGODB_URI, options).then((db) => db);
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
};

export default dbConnect;
