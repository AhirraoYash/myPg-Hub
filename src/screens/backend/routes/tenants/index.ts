import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { getTenants } from '../../controllers/tenantQueryController';

const getTenantsHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getTenants(user.property_id, page, limit);

    return NextResponse.json({
      message: 'Tenants fetched successfully',
      ...result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Tenants Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch tenants' }, { status: 500 });
  }
};

export const GET = withAuth(
  withRole(['Owner', 'Manager'], getTenantsHandler)
);
