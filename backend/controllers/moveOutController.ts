import mongoose from 'mongoose';
import { MoveOutNotice, IDeduction } from '../models/MoveOutNotice';
import { BedAssignmentHistory } from '../models/BedAssignmentHistory';
import { Invoice } from '../models/Invoice';
import { Bed } from '../models/Bed';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { Property } from '../models/Property';

export const submitNotice = async (tenant_id: string, property_id: string) => {
  // 1. Find active bed assignment
  const activeAssignment = await BedAssignmentHistory.findOne({
    tenant_id,
    is_active: true
  });

  if (!activeAssignment) {
    throw new Error('No active bed assignment found for this tenant.');
  }

  // 2. Get notice period from property settings
  const property = await Property.findById(property_id).lean();
  const noticeDays = property?.settings?.notice_period_days ?? 30;

  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + noticeDays);

  // 3. Create the MoveOutNotice
  const notice = new MoveOutNotice({
    property_id,
    tenant_id,
    bed_id:                 activeAssignment.bed_id,
    expected_move_out_date: expectedDate,
    status:                 'Notice_Given',
    deductions:             [],
    total_refund_calculated: 0
  });

  await notice.save();
  return notice;
};

export const generateSettlement = async (
  notice_id: string,
  property_id: string,
  manager_deductions: IDeduction[]
) => {
  const notice = await MoveOutNotice.findById(notice_id);
  if (!notice) throw new Error('Move-out notice not found');
  if (notice.property_id.toString() !== property_id.toString())
    throw new Error('Notice does not belong to this property');

  // 1. Fetch unpaid/partial invoices for this tenant
  const invoices = await Invoice.find({
    tenant_id: notice.tenant_id,
    status:    { $in: ['Unpaid', 'Partial'] }
  });

  const unpaidRent = invoices.reduce(
    (sum, inv) => sum + (inv.total_amount - inv.amount_paid), 0
  );
  const damages = manager_deductions.reduce((sum, d) => sum + d.amount, 0);

  // 2. Fetch deposit amount from property settings (dynamic, not hardcoded)
  const property = await Property.findById(property_id).lean();
  const depositAmount = property?.settings?.deposit_amount ?? 10000;

  const total_refund = depositAmount - unpaidRent - damages;

  notice.deductions             = manager_deductions;
  notice.total_refund_calculated = total_refund;
  notice.status                 = 'Settlement_Generated';

  await notice.save();
  return notice;
};

export const completeMoveOut = async (notice_id: string, property_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const notice = await MoveOutNotice.findById(notice_id).session(session);
    if (!notice) throw new Error('Move-out notice not found');
    if (notice.property_id.toString() !== property_id.toString())
      throw new Error('Notice does not belong to this property');

    const now = new Date();

    notice.status               = 'Completed';
    notice.actual_move_out_date = now;
    await notice.save({ session });

    const bed = await Bed.findById(notice.bed_id).session(session);
    if (!bed) throw new Error('Bed not found');
    bed.status = 'Vacant';
    await bed.save({ session });

    const assignment = await BedAssignmentHistory.findOne({
      tenant_id: notice.tenant_id,
      bed_id:    notice.bed_id,
      is_active: true
    }).session(session);

    if (assignment) {
      assignment.is_active = false;
      assignment.end_date  = now;
      await assignment.save({ session });
    }

    const role = await UserPropertyRole.findOne({
      user_id:    notice.tenant_id,
      property_id,
      role:       'Tenant',
      is_active:  true
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
