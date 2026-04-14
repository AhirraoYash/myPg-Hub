import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/auth';

export const updateProfile = async (user_id: string, data: any) => {
  const user = await User.findById(user_id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (data.first_name) user.first_name = data.first_name;
  if (data.last_name) user.last_name = data.last_name;
  if (data.phone) user.phone = data.phone;

  await user.save();
  return {
    _id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone
  };
};

export const changePassword = async (user_id: string, data: any) => {
  const user = await User.findById(user_id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isValid = await comparePassword(data.old_password, user.password_hash);
  if (!isValid) {
    throw new AppError('Invalid old password', 401);
  }

  user.password_hash = await hashPassword(data.new_password);
  await user.save();
  
  return { success: true };
};
