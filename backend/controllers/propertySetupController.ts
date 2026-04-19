import mongoose from 'mongoose';
import { Property } from '../models/Property';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { AppError } from '../utils/AppError';

export const createProperty = async (data: any, owner_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const property = new Property({
      name:     data.name,
      owner_id, // ✅ properly set
      address:  data.address,
      upi_id:   data.upi_id,
      settings: data.settings || {}
    });
    await property.save({ session });

    const role = new UserPropertyRole({
      user_id:    owner_id,
      property_id: property._id,
      role:       'Owner',
      is_active:  true
    });
    await role.save({ session });

    await session.commitTransaction();
    return property;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
