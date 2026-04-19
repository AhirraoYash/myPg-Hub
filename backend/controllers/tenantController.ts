import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { Bed } from '../models/Bed';
import { BedAssignmentHistory } from '../models/BedAssignmentHistory';
import { hashPin } from '../utils/auth';

export interface OnboardTenantData {
  phone: string;
  first_name: string;
  last_name: string;
  bed_id: string;
  email?: string;
  pin?: string; // custom PIN; defaults to last 4 digits of phone
}

export const onboardTenant = async (data: OnboardTenantData, property_id: string) => {
  // --- MONGODB TRANSACTION COMMENTED OUT ---
  // MongoDB Transactions are not supported on local standalone instances without a replica set.
  // We've temporarily commented out `startTransaction` and `session` usages.
  // For production (if using Replica Set or MongoDB Atlas), you can uncomment these lines 
  // and pass `{ session }` back into the queries.
  //
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { phone, first_name, last_name, bed_id, email, pin } = data;

    // Default PIN = last 4 digits of phone number
    const defaultPin = pin || phone.slice(-4);
    const pin_hash   = await hashPin(defaultPin);

    // Step 1: Find or create user by phone
    // let user = await User.findOne({ phone }).session(session);
    let user = await User.findOne({ phone });

    if (!user) {
      const newUser = new User({ phone, first_name, last_name, pin_hash, email });
      // user = await newUser.save({ session });
      user = await newUser.save();
    }

    // Step 2: Check for existing active role in this property
    // const existingRole = await UserPropertyRole.findOne({
    //   user_id:     user._id,
    //   property_id,
    //   is_active:   true
    // }).session(session);
    const existingRole = await UserPropertyRole.findOne({
      user_id:     user._id,
      property_id,
      is_active:   true
    });

    if (existingRole) {
      throw new Error('User is already an active tenant or staff in this property.');
    }

    const role = new UserPropertyRole({
      user_id: user._id,
      property_id,
      role: 'Tenant',
      is_active: true
    });
    // await role.save({ session });
    await role.save();

    // Step 3: Find the Bed and validate ownership + vacancy
    // const bed = await Bed.findById(bed_id).session(session);
    const bed = await Bed.findById(bed_id);
    if (!bed) throw new Error('Bed not found.');
    if (bed.property_id.toString() !== property_id.toString())
      throw new Error('Bed does not belong to this property.');
    if (bed.status !== 'Vacant')
      throw new Error('Bed is currently not vacant.');

    bed.status = 'Occupied';
    // await bed.save({ session });
    await bed.save();

    // Step 4: Create BedAssignmentHistory record
    const assignment = new BedAssignmentHistory({
      property_id,
      tenant_id:  user._id,
      bed_id:     bed._id,
      start_date: new Date(),
      is_active:  true
    });
    // await assignment.save({ session });
    await assignment.save();

    // await session.commitTransaction();
    return {
      success:    true,
      user_id:    user._id,
      bed_id:     bed._id,
      default_pin: pin ? undefined : defaultPin // expose only when auto-generated
    };
  } catch (error) {
    // await session.abortTransaction();
    throw error;
  } finally {
    // session.endSession();
  }
};
