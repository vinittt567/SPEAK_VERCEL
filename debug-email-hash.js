import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://kd121:${encodedPassword}@cluster0.vzenpdh.mongodb.net/speak_platform?retryWrites=true&w=majority`;

async function debugEmailHashing() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get the test student
    const testStudent = await db.collection('tempstudents').findOne({ studentId: 'stu011' });
    console.log('\n📧 Stored student data:');
    console.log('Student ID:', testStudent.studentId);
    console.log('Name:', testStudent.name);
    console.log('Stored hashed email:', testStudent.hashedEmail);
    
    // Test email hashing
    const testEmail = 'test.student@ju.ac.in';
    console.log('\n🔍 Testing email hashing...');
    console.log('Original email:', testEmail);
    
    // Hash the email the same way as in the populate script
    const hashedEmail = await bcrypt.hash(testEmail, 12);
    console.log('Newly hashed email:', hashedEmail);
    
    // Compare with stored hash
    console.log('\n🔄 Testing hash comparison...');
    const isMatch = await bcrypt.compare(testEmail, testStudent.hashedEmail);
    console.log('Does original email match stored hash?', isMatch);
    
    // Test password hashing too
    const testPassword = 'password123';
    console.log('\n🔐 Testing password hashing...');
    console.log('Test password:', testPassword);
    console.log('Stored hashed password:', testStudent.hashedPassword);
    
    const passwordMatch = await bcrypt.compare(testPassword, testStudent.hashedPassword);
    console.log('Does password match stored hash?', passwordMatch);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

debugEmailHashing();