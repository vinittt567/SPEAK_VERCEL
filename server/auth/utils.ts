import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Use string literal instead of env var
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LENGTH = 32;

export interface JWTPayload {
  anonymousId: string;
  institutionHash: string;
  iat?: number;
  exp?: number;
}

/**
 * Hash a string using bcrypt
 */
export async function hashString(data: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(data, saltRounds);
}

/**
 * Compare a string with its hash
 */
export async function compareHash(data: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(data, hash);
}

/**
 * Generate anonymous ID using PBKDF2
 */
export function generateAnonymousId(hashedEmail: string, salt?: string): string {
  const timestamp = Date.now().toString();
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  
  const derivedKey = crypto.pbkdf2Sync(
    hashedEmail + timestamp,
    actualSalt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    'sha256'
  );
  
  return `anon_${derivedKey.toString('hex')}`;
}

/**
 * Generate institution hash for anonymization
 */
export function generateInstitutionHash(domain: string): string {
  return crypto.createHash('sha256').update(domain).digest('hex');
}

/**
 * Generate JWT token for anonymous user
 */
export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'speak-platform',
    audience: 'speak-users'
  };
  
  return jwt.sign(
    payload as object, 
    JWT_SECRET, 
    options
  );
}

/**
 * Verify JWT token
 */
export function verifyJWT(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extract email domain
 */
export function extractEmailDomain(email: string): string {
  return email.split('@')[1];
}

/**
 * Generate secure random salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash token for storage (to prevent token theft from database)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}