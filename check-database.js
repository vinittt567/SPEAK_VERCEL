import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://kd121:${encodedPassword}@cluster0.vzenpdh.mongodb.net/speak_platform?retryWrites=true&w=majority`;

async function checkDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    console.log('\n📋 Checking collections and data:');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check institutions collection
    const institutions = await db.collection('institutions').find({}).toArray();
    console.log(`\n🏫 Institutions (${institutions.length}):`);
    institutions.forEach(inst => {
      console.log(`  - ${inst.name} (${inst.domain})`);
    });
    
    // Check students collection  
    const students = await db.collection('tempstudents').find({}).toArray();
    console.log(`\n👥 Students (${students.length}):`);
    students.forEach(student => {
      console.log(`  - ${student.name} (${student.studentId})`);
    });
    
    // Test specific student lookup
    console.log('\n🔍 Looking for test student...');
    const testStudent = await db.collection('tempstudents').findOne({ studentId: 'stu011' });
    if (testStudent) {
      console.log('✅ Test student found:', testStudent.name);
      console.log('  - Institution ID:', testStudent.institutionId);
      console.log('  - Course:', testStudent.course);
      console.log('  - Year:', testStudent.year);
    } else {
      console.log('❌ Test student not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

checkDatabase();