import { User } from '../models/User';
import { Property } from '../models/Property';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { comparePin, generateToken, hashPin } from '../utils/auth';

/**
 * Register a new PG Owner and Property
 * This is a temporary endpoint for initial setup
 */
export const registerOwnerAndProperty = async (data: {
  phone: string;
  pin: string;
  first_name: string;
  last_name: string;
  pg_name: string;
  address?: string;
}) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ phone: data.phone });
  if (existingUser) {
    throw new Error('User with this phone number already exists.');
  }

  // 2. Hash PIN and create User
  const pin_hash = await hashPin(data.pin);
  const user = await User.create({
    phone: data.phone,
    pin_hash,
    first_name: data.first_name,
    last_name: data.last_name,
  });

  // 3. Create Property
  const property = await Property.create({
    name: data.pg_name,
    owner_id: user._id,
    address: data.address,
  });

  // 4. Create Role link
  const role = await UserPropertyRole.create({
    user_id: user._id,
    property_id: property._id,
    role: 'Owner',
    is_active: true,
  });

  // 5. Generate token (similar to login)
  const token = generateToken({
    user_id: user.id.toString(),
    property_id: property.id.toString(),
    role: role.role
  });

  return {
    token,
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone
    },
    property: {
      id: property._id,
      name: property.name,
      role: role.role
    }
  };
};

/**
 * Phone + PIN login
 * Returns JWT token + safe user profile
 */
export const loginUser = async (phone: string, pin: string) => {
  // 1. Find user by phone number
  const user = await User.findOne({ phone });
  if (!user) {
    throw new Error('Invalid phone number or PIN');
  }

  // 2. Compare PIN
  const isPinValid = await comparePin(pin, user.pin_hash);
  if (!isPinValid) {
    throw new Error('Invalid phone number or PIN');
  }

  // 3. Find active role & property assignment
  const userRole = await UserPropertyRole.findOne({
    user_id: user._id,
    is_active: true
  });

  if (!userRole) {
    throw new Error('Your account is not assigned to any active property.');
  }

  // 4. Generate JWT
  const token = generateToken({
    user_id:     user._id.toString(),
    property_id: userRole.property_id.toString(),
    role:        userRole.role
  });

  return {
    token,
    user: {
      id:          user._id,
      phone:       user.phone,
      first_name:  user.first_name,
      last_name:   user.last_name,
      role:        userRole.role,
      property_id: userRole.property_id
    }
  };
};

/**
 * Returns the current user's profile from their JWT user_id
 */
export const getCurrentUser = async (user_id: string) => {
  const user = await User.findById(user_id).select('-pin_hash');
  if (!user) throw new Error('User not found');

  const userRole = await UserPropertyRole.findOne({
    user_id: user._id,
    is_active: true
  });

  return {
    ...user.toObject(),
    role:        userRole?.role,
    property_id: userRole?.property_id
  };
};
