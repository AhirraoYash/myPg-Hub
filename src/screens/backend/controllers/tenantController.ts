import mongoose from 'mongoose';
import { User } from '../models/User';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { Bed } from '../models/Bed';
import { BedAssignmentHistory } from '../models/BedAssignmentHistory';
import { hashPassword } from '../utils/auth';

export interface OnboardTenantData {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  bed_id: string;
  password?: string;
}

export const onboardTenant = async (data: OnboardTenantData, property_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, phone, first_name, last_name, bed_id, password } = data;

    // Step 1: Check if the user email/phone already exists
    let user = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { phone }] 
    }).session(session);

    if (!user) {
      // Create the User
      const defaultPassword = password || 'Welcome@123';
      const password_hash = await hashPassword(defaultPassword);
      
      const newUser = new User({
        email: email.toLowerCase(),
        phone,
        first_name,
        last_name,
        password_hash
      });
      
      user = await newUser.save({ session });
    }

    // Step 2: Create a UserPropertyRole assigning them as a 'Tenant'
    const existingRole = await UserPropertyRole.findOne({
      user_id: user._id,
      property_id,
      is_active: true
    }).session(session);

    if (existingRole) {
      throw new Error('User is already an active tenant or staff in this property.');
    }

    const role = new UserPropertyRole({
      user_id: user._id,
      property_id,
      role: 'Tenant',
      is_active: true
    });
    await role.save({ session });

    // Step 3: Find the Bed by ID and update status
    const bed = await Bed.findById(bed_id).session(session);
    if (!bed) {
      throw new Error('Bed not found.');
    }
    if (bed.property_id.toString() !== property_id.toString()) {
      throw new Error('Bed does not belong to this property.');
    }
    if (bed.status !== 'Vacant') {
      throw new Error('Bed is currently not vacant.');
    }

    bed.status = 'Occupied';
    await bed.save({ session }); // Mongoose optimistic concurrency protects this

    // Step 4: Create an active BedAssignmentHistory record
    const assignment = new BedAssignmentHistory({
      property_id,
      tenant_id: user._id,
      bed_id: bed._id,
      start_date: new Date(),
      is_active: true
    });
    await assignment.save({ session });

    await session.commitTransaction();
    return { 
      success: true, 
      user_id: user._id, 
      bed_id: bed._id 
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
