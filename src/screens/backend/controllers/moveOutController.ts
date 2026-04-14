import mongoose from 'mongoose';
import { MoveOutNotice, IDeduction } from '../models/MoveOutNotice';
import { BedAssignmentHistory } from '../models/BedAssignmentHistory';
import { Invoice } from '../models/Invoice';
import { Bed } from '../models/Bed';
import { UserPropertyRole } from '../models/UserPropertyRole';

export const submitNotice = async (tenant_id: string, property_id: string) => {
  // 1. Find active bed assignment to get the bed_id
  const activeAssignment = await BedAssignmentHistory.findOne({
    tenant_id,
    is_active: true
  });

  if (!activeAssignment) {
    throw new Error('No active bed assignment found for this tenant.');
  }

  // 2. Calculate expected move out date (30 days from notice date)
  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + 30);

  // 3. Create the MoveOutNotice
  const notice = new MoveOutNotice({
    property_id,
    tenant_id,
    bed_id: activeAssignment.bed_id,
    expected_move_out_date: expectedDate,
    status: 'Notice_Given',
    deductions: [],
    total_refund_calculated: 0
  });

  await notice.save();
  return notice;
};

export const generateSettlement = async (notice_id: string, property_id: string, manager_deductions: IDeduction[]) => {
  const notice = await MoveOutNotice.findById(notice_id);
  
  if (!notice) {
    throw new Error('Move-out notice not found');
  }
  
  if (notice.property_id.toString() !== property_id.toString()) {
    throw new Error('Notice does not belong to this property');
  }

  // 1. Fetch all 'Unpaid' or 'Partial' invoices for this tenant
  const invoices = await Invoice.find({
    tenant_id: notice.tenant_id,
    status: { $in: ['Unpaid', 'Partial'] }
  });

  // 2. Calculate total unpaid rent
  const unpaidRent = invoices.reduce((sum, inv) => sum + (inv.total_amount - inv.amount_paid), 0);
  
  // 3. Calculate total damages from manager deductions
  const damages = manager_deductions.reduce((sum, ded) => sum + ded.amount, 0);

  // 4. Calculate total refund (Assuming a flat ₹10000 base deposit for this draft)
  const BASE_DEPOSIT = 10000;
  const total_refund = BASE_DEPOSIT - unpaidRent - damages;

  // 5. Update notice with deductions and calculated refund
  notice.deductions = manager_deductions;
  notice.total_refund_calculated = total_refund;
  notice.status = 'Settlement_Generated';

  await notice.save();
  return notice;
};

export const completeMoveOut = async (notice_id: string, property_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const notice = await MoveOutNotice.findById(notice_id).session(session);
    if (!notice) throw new Error('Move-out notice not found');
    if (notice.property_id.toString() !== property_id.toString()) {
      throw new Error('Notice does not belong to this property');
    }

    const now = new Date();

    // 1. Update MoveOutNotice to 'Completed' and set actual_move_out_date
    notice.status = 'Completed';
    notice.actual_move_out_date = now;
    await notice.save({ session });

    // 2. Update the Bed status back to 'Vacant' and increment its version
    const bed = await Bed.findById(notice.bed_id).session(session);
    if (!bed) throw new Error('Bed not found');
    bed.status = 'Vacant';
    bed.__v = (bed.__v || 0) + 1; // Optimistic Concurrency
    await bed.save({ session });

    // 3. Update BedAssignmentHistory is_active to false and set end_date
    const assignment = await BedAssignmentHistory.findOne({
      tenant_id: notice.tenant_id,
      bed_id: notice.bed_id,
      is_active: true
    }).session(session);
    
    if (assignment) {
      assignment.is_active = false;
      assignment.end_date = now;
      await assignment.save({ session });
    }

    // 4. Update UserPropertyRole is_active to false (Revoke tenant access)
    const role = await UserPropertyRole.findOne({
      user_id: notice.tenant_id,
      property_id: property_id,
      role: 'Tenant',
      is_active: true
    }).session(session);

    if (role) {
      role.is_active = false;
      await role.save({ session });
    }

    await session.commitTransaction();
    return notice;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
