import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Define the structure of our JWT payload
export interface AuthPayload {
  user_id: string;
  property_id: string;
  role: 'Owner' | 'Manager' | 'Tenant';
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
const JWT_EXPIRES_IN = '7d'; // e.g., 7 days

/**
 * Generates a signed JWT for the user
 */
export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies and decodes a JWT
 * Throws an error if the token is invalid or expired
 */
export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};

/**
 * Hashes a plain text password using bcryptjs
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plain text password with a hashed password
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
