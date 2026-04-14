import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { getMoveOutNotices } from '../../controllers/moveOutQueryController';

const getNoticesHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getMoveOutNotices(user.property_id, status, page, limit);

    return NextResponse.json({
      message: 'Move-out notices fetched successfully',
      ...result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Move-Out Notices Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch notices' }, { status: 500 });
  }
};

export const GET = withAuth(
  withRole(['Owner', 'Manager'], getNoticesHandler)
);
