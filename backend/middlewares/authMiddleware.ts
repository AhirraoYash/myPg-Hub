import { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthPayload } from '../utils/auth';

// Extend Express Request to carry the decoded JWT payload
export interface AuthRequest extends Request {
  user?: AuthPayload;
}

/**
 * Express middleware: verifies the JWT in Authorization header or cookie.
 * Injects decoded payload into req.user.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // 1. Try HTTP-only cookie first
    token = req.cookies?.token;

    // 2. Fallback: Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: No authentication token provided' });
      return;
    }

    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
