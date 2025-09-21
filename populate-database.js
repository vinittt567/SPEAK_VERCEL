import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://kd121:${encodedPassword}@cluster0.vzenpdh.mongodb.net/speak_platform?retryWrites=true&w=majority`;

// Define schemas
const InstitutionSchema = new mongoose.Schema({
  institutionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  hashedDomain: { type: String, required: true }
}, { timestamps: true });

const TempStudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  hashedEmail: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  institutionId: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const Institution = mongoose.model('Institution', InstitutionSchema);
const TempStudent = mongoose.model('TempStudent', TempStudentSchema);

// Mock data
const MOCK_INSTITUTIONS = [
  { id: "ju001", name: "University of Jammu", domain: "ju.ac.in", type: "university", location: "Jammu", state: "Jammu and Kashmir" },
  { id: "cuk001", name: "Central University of Kashmir", domain: "cukashmir.ac.in", type: "university", location: "Ganderbal", state: "Jammu and Kashmir" },
  { id: "nit001", name: "National Institute of Technology Srinagar", domain: "nitsri.ac.in", type: "institute", location: "Srinagar", state: "Jammu and Kashmir" }
];

const MOCK_STUDENTS = [
  { id: "stu011", email: "test.student@ju.ac.in", institution_id: "ju001", name: "Test Student", course: "Computer Science", year: 1 }
];

function generateInstitutionHash(domain) {
  return crypto.createHash('sha256').update(domain).digest('hex');
}

async function hashString(data) {
  const saltRounds = 12;
  return await bcrypt.hash(data, saltRounds);
}

async function populateDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    console.log('🗑️ Clearing existing data...');
    await Institution.deleteMany({});
    await TempStudent.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('🏫 Adding institutions...');
    for (const inst of MOCK_INSTITUTIONS) {
      const hashedDomain = generateInstitutionHash(inst.domain);
      await Institution.create({
        institutionId: inst.id,
        name: inst.name,
        domain: inst.domain,
        type: inst.type,
        location: inst.location,
        state: inst.state,
        hashedDomain
      });
      console.log(`  ✓ Added ${inst.name} (${inst.domain})`);
    }

    console.log('👥 Adding students...');
    for (const student of MOCK_STUDENTS) {
      const hashedEmail = await hashString(student.email);
      const hashedPassword = await hashString('password123');
      
      await TempStudent.create({
        studentId: student.id,
        hashedEmail,
        hashedPassword,
        institutionId: student.institution_id,
        name: student.name,
        course: student.course,
        year: student.year
      });
      console.log(`  ✓ Added ${student.name} (${student.email})`);
    }

    console.log('🎉 Database populated successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${MOCK_INSTITUTIONS.length} institutions added`);
    console.log(`- ${MOCK_STUDENTS.length} students added`);
    console.log('\n🧪 Demo Account:');
    console.log('Email: test.student@ju.ac.in');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

populateDatabase();