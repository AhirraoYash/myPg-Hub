import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { hashPin, comparePin } from '../utils/auth';

export const updateProfile = async (user_id: string, data: any) => {
  const user = await User.findById(user_id);
  if (!user) throw new AppError('User not found', 404);

  if (data.first_name) user.first_name = data.first_name;
  if (data.last_name)  user.last_name  = data.last_name;
  if (data.email)      user.email      = data.email;

  await user.save();
  return {
    _id:        user._id,
    phone:      user.phone,
    first_name: user.first_name,
    last_name:  user.last_name,
    email:      user.email
  };
};

export const changePIN = async (user_id: string, data: any) => {
  const user = await User.findById(user_id);
  if (!user) throw new AppError('User not found', 404);

  const isValid = await comparePin(data.old_pin, user.pin_hash);
  if (!isValid) throw new AppError('Invalid current PIN', 401);

  user.pin_hash = await hashPin(data.new_pin);
  await user.save();

  return { success: true };
};
