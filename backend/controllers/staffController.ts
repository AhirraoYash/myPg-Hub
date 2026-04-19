import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { hashPin } from '../utils/auth';
import { AppError } from '../utils/AppError';

export const addManager = async (data: any, property_id: string) => {
  // --- MONGODB TRANSACTION COMMENTED OUT ---
  // MongoDB Transactions are not supported on local standalone instances without a replica set.
  // We've temporarily commented out `startTransaction` and `session` usages.
  // For production (if using Replica Set or MongoDB Atlas), you can uncomment these lines 
  // and pass `{ session }` back into the queries.
  //
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    // 1. Find or create user by phone
    // let user = await User.findOne({ phone: data.phone }).session(session);
    let user = await User.findOne({ phone: data.phone });

    if (!user) {
      // Default PIN = last 4 digits of phone
      const defaultPin = data.pin || data.phone.slice(-4);
      const pin_hash   = await hashPin(defaultPin);

      user = new User({
        phone:      data.phone,
        first_name: data.first_name,
        last_name:  data.last_name,
        email:      data.email,
        pin_hash
      });
      // await user.save({ session });
      await user.save();
    }

    // 2. Check existing active role for this property
    // const existingRole = await UserPropertyRole.findOne({
    //   user_id:   user._id,
    //   property_id,
    //   is_active: true
    // }).session(session);
    const existingRole = await UserPropertyRole.findOne({
      user_id:   user._id,
      property_id,
      is_active: true
    });

    if (existingRole) {
      throw new AppError(`User is already active as a ${existingRole.role} in this property`, 400);
    }

    // 3. Deactivate any previous inactive record then create Manager role
    const role = new UserPropertyRole({
      user_id: user._id,
      property_id,
      role: 'Manager',
      is_active: true
    });
    // await role.save({ session });
    await role.save();

    // await session.commitTransaction();
    return user;
  } catch (error) {
    // await session.abortTransaction();
    throw error;
  } finally {
    // session.endSession();
  }
};

/** Deactivate a manager's access to this property */
export const removeManager = async (manager_user_id: string, property_id: string) => {
  const role = await UserPropertyRole.findOne({
    user_id:   manager_user_id,
    property_id,
    role:      'Manager',
    is_active: true
  });

  if (!role) throw new AppError('Active manager not found in this property', 404);

  role.is_active = false;
  await role.save();
  return { success: true };
};

/** List all active managers for a property */
export const getManagers = async (property_id: string) => {
  const roles = await UserPropertyRole.find({
    property_id,
    role:      'Manager',
    is_active: true
  }).lean();

  const userIds = roles.map(r => r.user_id);
  const users   = await User.find({ _id: { $in: userIds } }).select('-pin_hash').lean();
  return users;
};
