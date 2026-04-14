import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AuthPayload } from '../utils/auth';

// Define a custom type for handlers that require authentication
export type AuthenticatedHandler = (
  req: NextRequest,
  context: any,
  user: AuthPayload
) => Promise<NextResponse> | NextResponse;

/**
 * Middleware to protect API routes.
 * Extracts JWT from Cookies or Authorization header, verifies it, 
 * and injects the decoded user payload into the handler.
 */
export const withAuth = (handler: AuthenticatedHandler) => {
  return async (req: NextRequest, context: any): Promise<NextResponse> => {
    try {
      let token: string | undefined;

      // 1. Try to extract token from HTTP-only cookies
      token = req.cookies.get('token')?.value;

      // 2. Fallback to Authorization header (Bearer token)
      if (!token) {
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized: No authentication token provided' },
          { status: 401 }
        );
      }

      // Verify token
      const decodedUser = verifyToken(token);

      // Execute the route handler with the injected user payload
      return await handler(req, context, decodedUser);
      
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }
  };
};
