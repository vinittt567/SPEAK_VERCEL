import mongoose from 'mongoose';

const DB_PASSWORD = process.env.DB_PASSWORD || '';
// URL encode the password to handle special characters
const encodedPassword = encodeURIComponent(DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://kd121:${encodedPassword}@cluster0.vzenpdh.mongodb.net/speak_platform?retryWrites=true&w=majority`;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  if (!DB_PASSWORD || DB_PASSWORD === 'your_mongodb_password_here') {
    throw new Error('MongoDB password not set. Please update DB_PASSWORD in your .env file.');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

export default mongoose;