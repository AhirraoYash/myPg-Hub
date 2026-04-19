import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AuthPayload } from '../utils/auth';

/**
 * Express middleware factory: enforces Role-Based Access Control.
 * Must come AFTER the authenticate middleware.
 *
 * @param allowedRoles array of roles that may access the route
 */
export const authorize = (allowedRoles: AuthPayload['role'][]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: missing user context' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        error:         'Forbidden: You do not have the required permissions',
        requiredRoles: allowedRoles,
        userRole:      user.role
      });
      return;
    }

    next();
  };
};
