import mongoose from 'mongoose';
import 'dotenv/config';

const DB_PASSWORD = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(DB_PASSWORD);
const MONGODB_URI = `mongodb+srv://kd121:${encodedPassword}@cluster0.vzenpdh.mongodb.net/speak_platform?retryWrites=true&w=majority`;

// Define the Counselor Schema
const CounselorSchema = new mongoose.Schema({
  counselorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: [{ type: String }],
  languages: [{ type: String }],
  mode: { type: String, enum: ['Online', 'In-person', 'Both'], required: true },
  status: { type: String, enum: ['Available', 'Full', 'Online only'], required: true },
  meetingInfo: {
    platform: { type: String, enum: ['Google Meet', 'Zoom'], required: true },
    link: { type: String, required: true }
  }
}, {
  timestamps: true
});

const Counselor = mongoose.model('Counselor', CounselorSchema);

const counselors = [
  {
    counselorId: "counsellor_1",
    name: "Dr. Sharma",
    specialty: ["Stress", "Anxiety"],
    languages: ["English", "Hindi"],
    mode: "Both",
    status: "Available",
    meetingInfo: {
      platform: "Google Meet",
      link: "https://meet.google.com/wkv-wsst-pdy"
    }
  },
  {
    counselorId: "counsellor_2",
    name: "Dr. Singh",
    specialty: ["Career", "Stress"],
    languages: ["English", "Hindi"],
    mode: "Online",
    status: "Available",
    meetingInfo: {
      platform: "Google Meet",
      link: "https://meet.google.com/dqc-uwht-jph"
    }
  }
];

async function populateCounselors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing counselors
    await Counselor.deleteMany({});
    console.log('Cleared existing counselors');

    // Insert new counselors
    const result = await Counselor.insertMany(counselors);
    console.log('Inserted counselors:', result);

    console.log('Database population completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

populateCounselors();