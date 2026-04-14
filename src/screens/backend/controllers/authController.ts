import { User } from '../models/User';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { comparePassword, generateToken } from '../utils/auth';

export const loginUser = async (email: string, password: string) => {
  // 1. Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Compare password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // 3. Find active role and property assignment
  const userRole = await UserPropertyRole.findOne({
    user_id: user._id,
    is_active: true
  });

  if (!userRole) {
    throw new Error('Your account is not assigned to any active property.');
  }

  // 4. Generate JWT
  const token = generateToken({
    user_id: user._id.toString(),
    property_id: userRole.property_id.toString(),
    role: userRole.role
  });

  // 5. Return token and safe user data
  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: userRole.role,
      property_id: userRole.property_id
    }
  };
};

export const getCurrentUser = async (user_id: string) => {
  // Fetch user profile, explicitly excluding the password hash
  const user = await User.findById(user_id).select('-password_hash');
  
  if (!user) {
    throw new Error('User not found');
  }

  // Fetch their active role to include in the profile response
  const userRole = await UserPropertyRole.findOne({
    user_id: user._id,
    is_active: true
  });

  return {
    ...user.toObject(),
    role: userRole?.role,
    property_id: userRole?.property_id
  };
};
