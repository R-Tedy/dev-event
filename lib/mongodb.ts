import mongoose from "mongoose";

// define connection to the cache type
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// extend the global object to include our mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

// initialize the cache on the global object to persist across hot reloads in development

const cached: MongooseCache = global.mongoose || {conn: null, promise: null}; //used let in the tutorial

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establish a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads
 * return Promise resolving to the Mongoose instance.
 */

async function connectDB():Promise<typeof mongoose> {
  // return an existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // return an existing connection promise if one is in progress
  if (!cached.promise) {
    // validate mongodb_uri exists
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env'
      );
    }

    const options = {
      bufferCommands: false,  //disable mongoose buffering
    };

    // create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // wait for connection establishment
    cached.conn = await cached.promise;
  } catch (error) {
    // reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;