import mongoose from 'mongoose';
import { UserPropertyRole } from '../models/UserPropertyRole';
import { Bed } from '../models/Bed';
import { Invoice } from '../models/Invoice';
import { Complaint } from '../models/Complaint';

export const getOwnerMetrics = async (property_id: string, month?: string) => {
  const propId = new mongoose.Types.ObjectId(property_id);

  // Date filtering logic
  let dateMatch: any = {};
  if (month) {
    // Expecting month format 'YYYY-MM'
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    dateMatch = { createdAt: { $gte: startDate, $lt: endDate } };
  }

  const [
    totalActiveTenants,
    occupancyData,
    financialData,
    operationalStats
  ] = await Promise.all([
    // 1. Total Active Tenants (Current snapshot, usually not date filtered, but we keep it as is)
    UserPropertyRole.countDocuments({
      property_id: propId,
      role: 'Tenant',
      is_active: true
    }),

    // 2. Occupancy Stats using Aggregate (Current snapshot)
    Bed.aggregate([
      { $match: { property_id: propId } },
      {
        $group: {
          _id: null,
          totalBeds: { $sum: 1 },
          occupiedBeds: {
            $sum: { $cond: [{ $eq: ['$status', 'Occupied'] }, 1, 0] }
          }
        }
      }
    ]),

    // 3. Financials using Aggregate (Date filtered)
    Invoice.aggregate([
      { $match: { property_id: propId, ...dateMatch } },
      {
        $group: {
          _id: null,
          total_revenue: { $sum: '$amount_paid' },
          pending_dues: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Unpaid', 'Partial']] },
                { $subtract: ['$total_amount', '$amount_paid'] },
                0
              ]
            }
          }
        }
      }
    ]),

    // 4. Operational Stats (Date filtered)
    Complaint.countDocuments({
      property_id: propId,
      status: { $in: ['Open', 'In_Progress'] },
      ...dateMatch
    })
  ]);

  // Safely extract aggregated values
  const totalBeds = occupancyData[0]?.totalBeds || 0;
  const occupiedBeds = occupancyData[0]?.occupiedBeds || 0;
  const occupancy_rate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return {
    totalActiveTenants,
    occupancyStats: {
      totalBeds,
      occupiedBeds,
      occupancy_rate
    },
    financials: {
      total_revenue: financialData[0]?.total_revenue || 0,
      pending_dues: financialData[0]?.pending_dues || 0
    },
    operationalStats: {
      openComplaints: operationalStats
    }
  };
};
