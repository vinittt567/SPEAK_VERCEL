import mongoose from 'mongoose';

// Schema for storing initial institutional data (for verification only)
const InstitutionSchema = new mongoose.Schema({
  institutionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  hashedDomain: { type: String, required: true, index: true }, // Hashed for privacy
}, {
  timestamps: true
});

// Schema for storing initial student data (temporary, deleted after verification)
const TempStudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  hashedEmail: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  institutionId: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Schema for anonymous user profiles (permanent)
const AnonymousUserSchema = new mongoose.Schema({
  anonymousId: { type: String, required: true, unique: true }, // PBKDF2 generated pseudonym
  institutionHash: { type: String, required: true }, // Linked to institution but anonymized
  profileData: {
    course: { type: String, required: true },
    year: { type: Number, required: true },
    joinedAt: { type: Date, default: Date.now }
  },
  isActive: { type: Boolean, default: true },
  // No PII stored here - fully anonymized
}, {
  timestamps: true
});

// Schema for JWT tokens (for token blacklisting/management)
const TokenSchema = new mongoose.Schema({
  anonymousId: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isRevoked: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Only create TTL index for tokens
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired tokens

// Schema for counselors with their meeting links
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

// Create index for counselor lookups
CounselorSchema.index({ counselorId: 1 });
CounselorSchema.index({ status: 1 });

export const Institution = mongoose.model('Institution', InstitutionSchema);
export const TempStudent = mongoose.model('TempStudent', TempStudentSchema);
export const AnonymousUser = mongoose.model('AnonymousUser', AnonymousUserSchema);
export const Token = mongoose.model('Token', TokenSchema);
export const Counselor = mongoose.model('Counselor', CounselorSchema);