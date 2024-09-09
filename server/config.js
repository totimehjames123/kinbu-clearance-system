// config.js

import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI; // Replace with your MongoDB URI 

const connectDB = mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Exit process with failure
});

export default connectDB;   
