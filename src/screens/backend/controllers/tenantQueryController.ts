import { UserPropertyRole } from '../models/UserPropertyRole';
import { User } from '../models/User';
import { BedAssignmentHistory } from '../models/BedAssignmentHistory';

export const getTenants = async (property_id: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  // 1. Find all active tenant roles for this property
  const roles = await UserPropertyRole.find({
    property_id,
    role: 'Tenant',
    is_active: true
  })
  .skip(skip)
  .limit(limit)
  .lean();

  const total = await UserPropertyRole.countDocuments({
    property_id,
    role: 'Tenant',
    is_active: true
  });

  if (!roles.length) {
    return { data: [], meta: { total, page, limit, totalPages: 0 } };
  }

  const userIds = roles.map(r => r.user_id);

  // 2. Fetch user details
  const users = await User.find({ _id: { $in: userIds } })
    .select('-password_hash')
    .lean();

  // 3. Fetch active bed assignments
  const assignments = await BedAssignmentHistory.find({
    tenant_id: { $in: userIds },
    is_active: true
  })
  .populate('bed_id', 'bed_identifier room_id')
  .lean();

  // Map assignments to users
  const assignmentMap = assignments.reduce((acc: any, curr: any) => {
    acc[curr.tenant_id.toString()] = curr;
    return acc;
  }, {});

  const data = users.map(user => ({
    ...user,
    assignment: assignmentMap[user._id.toString()] || null
  }));

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getTenantById = async (tenant_id: string, property_id: string) => {
  // 1. Verify the tenant belongs to this property
  const role = await UserPropertyRole.findOne({
    user_id: tenant_id,
    property_id,
    role: 'Tenant'
  }).lean();

  if (!role) {
    throw new Error('Tenant not found in this property');
  }

  // 2. Fetch user details
  const user = await User.findById(tenant_id).select('-password_hash').lean();

  // 3. Fetch active bed assignment
  const assignment = await BedAssignmentHistory.findOne({
    tenant_id,
    is_active: true
  })
  .populate({
    path: 'bed_id',
    select: 'bed_identifier room_id',
    populate: { path: 'room_id', select: 'room_number' }
  })
  .lean();

  return {
    ...user,
    is_active: role.is_active,
    assignment
  };
};
