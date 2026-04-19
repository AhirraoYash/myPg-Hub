import { Property } from '../models/Property';

export const getPropertySettings = async (property_id: string) => {
  const property = await Property.findById(property_id).lean();
  if (!property) throw new Error('Property not found');
  return property;
};

export const updatePropertySettings = async (property_id: string, data: any) => {
  const property = await Property.findById(property_id);
  if (!property) throw new Error('Property not found');

  if (data.name)    property.name    = data.name;
  if (data.address) property.address = data.address;
  if (data.upi_id)  property.upi_id  = data.upi_id;

  // Merge settings (only update provided keys)
  if (data.settings) {
    const s = data.settings;
    if (s.default_rent_due_date !== undefined)
      property.settings.default_rent_due_date = s.default_rent_due_date;
    if (s.late_fee_amount !== undefined)
      property.settings.late_fee_amount = s.late_fee_amount;
    if (s.notice_period_days !== undefined)
      property.settings.notice_period_days = s.notice_period_days;
    if (s.deposit_amount !== undefined)
      property.settings.deposit_amount = s.deposit_amount;
  }

  await property.save();
  return property;
};
