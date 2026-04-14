import { NextRequest, NextResponse } from 'next/server';
import { AuthPayload } from '../utils/auth';
import { AuthenticatedHandler } from './authMiddleware';

/**
 * Middleware to enforce Role-Based Access Control (RBAC).
 * Must be used in conjunction with (inside) `withAuth`.
 * 
 * @param allowedRoles Array of roles permitted to access the route
 * @param handler The authenticated route handler
 */
export const withRole = (
  allowedRoles: AuthPayload['role'][],
  handler: AuthenticatedHandler
): AuthenticatedHandler => {
  return async (req: NextRequest, context: any, user: AuthPayload): Promise<NextResponse> => {
    
    // Check if the user's role is in the allowed list
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { 
          error: 'Forbidden: You do not have the required permissions to perform this action',
          requiredRoles: allowedRoles,
          userRole: user.role
        },
        { status: 403 }
      );
    }

    // User is authorized, proceed to the handler
    return await handler(req, context, user);
  };
};
