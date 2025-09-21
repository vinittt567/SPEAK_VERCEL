import { Request, Response, NextFunction } from 'express';
import { verifyJWT, JWTPayload } from './utils';
import { Token } from '../database/models';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export async function authenticateToken(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
      return;
    }

    // Verify JWT
    const decoded = verifyJWT(token);
    
    // Check if token is revoked (optional - for better security)
    const tokenRecord = await Token.findOne({ 
      anonymousId: decoded.anonymousId,
      isRevoked: false
    });

    if (!tokenRecord) {
      res.status(401).json({ 
        error: 'Token has been revoked',
        code: 'TOKEN_REVOKED'
      });
      return;
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      error: 'Invalid token',
      code: 'TOKEN_INVALID'
    });
    return;
  }
}

/**
 * Optional middleware to verify token without failing
 */
export async function optionalAuth(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyJWT(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}