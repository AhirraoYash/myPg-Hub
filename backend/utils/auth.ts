import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Structure of our JWT payload
export interface AuthPayload {
  user_id: string;
  property_id: string;
  role: 'Owner' | 'Manager' | 'Tenant';
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_DO_NOT_USE_IN_PROD';
const JWT_EXPIRES_IN = '7d';

/** Generates a signed JWT */
export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/** Verifies and decodes a JWT — throws if invalid/expired */
export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};

/** Hashes a 4–6 digit PIN using bcrypt */
export const hashPin = async (pin: string): Promise<string> => {
  return bcrypt.hash(pin, 10);
};

/** Compares a plain PIN against its bcrypt hash */
export const comparePin = async (pin: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(pin, hash);
};
