import express, { Request, Response } from 'express';
import { connectToDatabase } from '../database/connection';
import { Institution, TempStudent, AnonymousUser, Token } from '../database/models';
import { 
  hashString, 
  compareHash, 
  generateAnonymousId, 
  generateInstitutionHash,
  extractEmailDomain,
  generateSalt,
  hashToken
} from '../auth/utils';
import { authenticateToken } from '../auth/middleware';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Mock data for J&K institutions
const MOCK_INSTITUTIONS = [
  { id: "ju001", name: "University of Jammu", domain: "ju.ac.in", type: "university", location: "Jammu", state: "Jammu and Kashmir" },
  { id: "cuk001", name: "Central University of Kashmir", domain: "cukashmir.ac.in", type: "university", location: "Ganderbal", state: "Jammu and Kashmir" },
  { id: "nit001", name: "National Institute of Technology Srinagar", domain: "nitsri.ac.in", type: "institute", location: "Srinagar", state: "Jammu and Kashmir" },
  { id: "iiim001", name: "Indian Institute of Integrative Medicine", domain: "iiim.ac.in", type: "institute", location: "Jammu", state: "Jammu and Kashmir" },
  { id: "skuast001", name: "Sher-e-Kashmir University of Agricultural Sciences and Technology", domain: "skuastkashmir.ac.in", type: "university", location: "Srinagar", state: "Jammu and Kashmir" },
  { id: "iust001", name: "Islamic University of Science and Technology", domain: "iust.ac.in", type: "university", location: "Awantipora", state: "Jammu and Kashmir" },
  { id: "bgsbu001", name: "Baba Ghulam Shah Badshah University", domain: "bgsbu.ac.in", type: "university", location: "Rajouri", state: "Jammu and Kashmir" },
  { id: "cluster001", name: "Cluster University Srinagar", domain: "cusrinagar.ac.in", type: "university", location: "Srinagar", state: "Jammu and Kashmir" },
  { id: "cluster002", name: "Cluster University Jammu", domain: "cujammu.ac.in", type: "university", location: "Jammu", state: "Jammu and Kashmir" },
  { id: "kuc001", name: "Kashmir University College", domain: "kashmiruniversity.ac.in", type: "college", location: "Srinagar", state: "Jammu and Kashmir" }
];

const MOCK_STUDENTS = [
  { id: "stu001", email: "john.doe@ju.ac.in", institution_id: "ju001", name: "John Doe", course: "Computer Science", year: 3 },
  { id: "stu002", email: "sarah.khan@cukashmir.ac.in", institution_id: "cuk001", name: "Sarah Khan", course: "Psychology", year: 2 },
  { id: "stu003", email: "ahmed.malik@nitsri.ac.in", institution_id: "nit001", name: "Ahmed Malik", course: "Electrical Engineering", year: 4 },
  { id: "stu004", email: "priya.sharma@iiim.ac.in", institution_id: "iiim001", name: "Priya Sharma", course: "Biotechnology", year: 1 },
  { id: "stu005", email: "mohit.gupta@skuastkashmir.ac.in", institution_id: "skuast001", name: "Mohit Gupta", course: "Agriculture", year: 2 },
  { id: "stu006", email: "fatima.ali@iust.ac.in", institution_id: "iust001", name: "Fatima Ali", course: "Islamic Studies", year: 3 },
  { id: "stu007", email: "rahul.singh@bgsbu.ac.in", institution_id: "bgsbu001", name: "Rahul Singh", course: "Business Administration", year: 4 },
  { id: "stu008", email: "zara.ahmad@cusrinagar.ac.in", institution_id: "cluster001", name: "Zara Ahmad", course: "English Literature", year: 1 },
  { id: "stu009", email: "vikram.kumar@cujammu.ac.in", institution_id: "cluster002", name: "Vikram Kumar", course: "Mathematics", year: 3 },
  { id: "stu010", email: "aisha.bhat@kashmiruniversity.ac.in", institution_id: "kuc001", name: "Aisha Bhat", course: "Political Science", year: 2 },
  { id: "stu011", email: "test.student@ju.ac.in", institution_id: "ju001", name: "Test Student", course: "Computer Science", year: 1 }
];

// Helper function to load and hash mock data
async function initializeMockData() {
  try {
    // Check if data already exists
    const existingInstitutions = await Institution.countDocuments();
    if (existingInstitutions > 0) {
      return; // Data already loaded
    }

    // Process and store institutions
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
    }

    // Process and store students with proper hashing
    for (const student of MOCK_STUDENTS) {
      const hashedEmail = await hashString(student.email);
      const hashedPassword = await hashString('password123'); // Default password for mock
      
      await TempStudent.create({
        studentId: student.id,
        hashedEmail,
        hashedPassword,
        institutionId: student.institution_id,
        name: student.name,
        course: student.course,
        year: student.year
      });
    }

    console.log('✅ Mock data initialized successfully with', MOCK_INSTITUTIONS.length, 'institutions and', MOCK_STUDENTS.length, 'students');
  } catch (error) {
    console.error('❌ Error initializing mock data:', error);
  }
}

/**
 * POST /api/auth/register
 * Registration with institutional email and password - generates anonymous ID
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    await initializeMockData();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Extract domain and verify against institutions
    const domain = extractEmailDomain(email);
    const institution = await Institution.findOne({ domain });

    if (!institution) {
      return res.status(401).json({
        error: 'Institution not recognized',
        code: 'INVALID_INSTITUTION'
      });
    }

    // Find all students for this institution and check email match
    const studentsFromInstitution = await TempStudent.find({ 
      institutionId: institution.institutionId 
    });

    let matchingStudent = null;
    for (const student of studentsFromInstitution) {
      const emailMatches = await compareHash(email, student.hashedEmail);
      if (emailMatches) {
        matchingStudent = student;
        break;
      }
    }

    if (!matchingStudent) {
      return res.status(401).json({
        error: 'Student not found',
        code: 'STUDENT_NOT_FOUND'
      });
    }

    // Verify password
    const isPasswordValid = await compareHash(password, matchingStudent.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate anonymous ID using the original email
    const salt = generateSalt();
    const hashedEmailForId = await hashString(email);
    const anonymousId = generateAnonymousId(hashedEmailForId, salt);
    const institutionHash = generateInstitutionHash(institution.domain);

    // Create anonymous user profile
    const anonymousUser = await AnonymousUser.create({
      anonymousId,
      institutionHash,
      profileData: {
        course: matchingStudent.course,
        year: matchingStudent.year,
        joinedAt: new Date()
      }
    });

    // Generate JWT token
    const tokenPayload = {
      anonymousId,
      institutionHash
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'speak-platform',
      audience: 'speak-users'
    });

    // Store token hash for tracking
    const tokenHash = hashToken(token);
    await Token.create({
      anonymousId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // DELETE the temporary student record to ensure no PII retention
    await TempStudent.findByIdAndDelete(matchingStudent._id);

    res.json({
      success: true,
      message: 'Registration successful! Your anonymous ID has been generated.',
      token,
      user: {
        anonymousId,
        profileData: anonymousUser.profileData
      },
      showAnonymousId: true // Flag to show popup in frontend
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/login
 * Login using anonymous ID
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();

    const { anonymousId } = req.body;

    if (!anonymousId) {
      return res.status(400).json({
        error: 'Anonymous ID is required',
        code: 'MISSING_ANONYMOUS_ID'
      });
    }

    // Find anonymous user
    const user = await AnonymousUser.findOne({ 
      anonymousId,
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        error: 'Anonymous user not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate new JWT token
    const tokenPayload = {
      anonymousId: user.anonymousId,
      institutionHash: user.institutionHash
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'speak-platform', 
      audience: 'speak-users'
    });

    // Store new token hash
    const tokenHash = hashToken(token);
    await Token.create({
      anonymousId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        anonymousId: user.anonymousId,
        profileData: user.profileData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout and revoke token
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    await connectToDatabase();

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const tokenHash = hashToken(token);
      await Token.updateOne(
        { tokenHash },
        { isRevoked: true }
      );
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    await connectToDatabase();

    const user = await AnonymousUser.findOne({ 
      anonymousId: req.user!.anonymousId,
      isActive: true 
    });

    if (!user) {
      return res.status(404).json({
        error: 'User profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      user: {
        anonymousId: user.anonymousId,
        profileData: user.profileData
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify if current token is valid
 */
router.get('/verify', authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      anonymousId: req.user!.anonymousId,
      institutionHash: req.user!.institutionHash
    }
  });
});

export default router;