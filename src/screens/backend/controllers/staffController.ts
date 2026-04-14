import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { hashPassword } from '../utils/auth';
import { AppError } from '../utils/AppError';

export const addManager = async (data: any, property_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Find or create the user
    let user = await User.findOne({ email: data.email.toLowerCase() }).session(session);
    
    if (!user) {
      const password_hash = await hashPassword(data.password || 'Manager@123');
      user = new User({
        email: data.email.toLowerCase(),
        phone: data.phone,
        first_name: data.first_name,
        last_name: data.last_name,
        password_hash
      });
      await user.save({ session });
    }

    // 2. Check existing roles for this property
    const existingRole = await UserPropertyRole.findOne({ 
      user_id: user._id, 
      property_id 
    }).session(session);

    if (existingRole) {
      if (existingRole.is_active) {
        throw new AppError(`User is already active as a ${existingRole.role} in this property`, 400);
      }
      // Reactivate as Manager
      existingRole.is_active = true;
      existingRole.role = 'Manager';
      await existingRole.save({ session });
    } else {
      // 3. Create new Manager role
      const role = new UserPropertyRole({
        user_id: user._id,
        property_id,
        role: 'Manager',
        is_active: true
      });
      await role.save({ session });
    }

    await session.commitTransaction();
    return user;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
