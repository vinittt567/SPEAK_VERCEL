import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoConnection() {
  try {
    const DB_PASSWORD = process.env.DB_PASSWORD || '';
    console.log('🔍 Testing MongoDB Connection...');
    console.log('Password set:', DB_PASSWORD ? 'Yes' : 'No');
    console.log('Password length:', DB_PASSWORD.length);
    
    if (!DB_PASSWORD || DB_PASSWORD === 'your_mongodb_password_here') {
      console.log('❌ MongoDB password not set properly in .env file');
      console.log('Please update DB_PASSWORD in your .env file with the actual password');
      return;
    }

    // URL encode the password to handle special characters
    const encodedPassword = encodeURIComponent(DB_PASSWORD);
    const MONGODB_URI = `mongodb+srv://kd121:${encodedPassword}@cluster0.vzenpdh.mongodb.net/speak_platform?retryWrites=true&w=majority`;
    
    console.log('🔗 Connecting to MongoDB...');
    console.log('URI (without password):', MONGODB_URI.replace(encodedPassword, '[HIDDEN]'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test basic operations
    console.log('🧪 Testing database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ MongoDB connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('💡 The password appears to be incorrect. Please verify:');
      console.log('1. The password in your .env file is correct');
      console.log('2. The username "kushald121" is correct');
      console.log('3. The MongoDB Atlas cluster is accessible');
    }
    
    process.exit(1);
  }
}

testMongoConnection();