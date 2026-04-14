import { Property } from '../models/Property';

export const getPropertySettings = async (property_id: string) => {
  const property = await Property.findById(property_id).lean();
  
  if (!property) {
    throw new Error('Property not found');
  }

  return property;
};
