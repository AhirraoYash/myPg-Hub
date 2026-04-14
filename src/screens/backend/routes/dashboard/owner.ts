import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { getOwnerMetrics } from '../../controllers/dashboardController';

const getOwnerDashboardHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') || undefined;

    // Extract property_id from the decoded JWT context to ensure strict data isolation
    const metrics = await getOwnerMetrics(user.property_id, month);
    
    return NextResponse.json({
      message: 'Owner metrics fetched successfully',
      data: metrics
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Owner Metrics Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch owner metrics' }, { status: 500 });
  }
};

export const GET = withAuth(
  withRole(['Owner'], getOwnerDashboardHandler)
);
