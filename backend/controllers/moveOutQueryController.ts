import { MoveOutNotice } from '../models/MoveOutNotice';

export const getMoveOutNotices = async (property_id: string, statusFilter?: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const query: any = { property_id };

  if (statusFilter) {
    query.status = statusFilter;
  }

  const notices = await MoveOutNotice.find(query)
    .sort({ expected_move_out_date: 1 })
    .skip(skip)
    .limit(limit)
    .populate('tenant_id', 'first_name last_name email')
    .populate('bed_id', 'bed_identifier room_id')
    .lean();

  const total = await MoveOutNotice.countDocuments(query);

  return {
    data: notices,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
