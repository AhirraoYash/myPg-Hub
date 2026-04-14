import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { getTenantById } from '../../controllers/tenantQueryController';

const getTenantByIdHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    // Extract tenant ID from URL params
    const tenant_id = context?.params?.id;
    
    if (!tenant_id) {
      return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
    }

    const tenant = await getTenantById(tenant_id, user.property_id);

    return NextResponse.json({
      message: 'Tenant fetched successfully',
      data: tenant
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Tenant Error:', error);
    if (error.message === 'Tenant not found in this property') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch tenant' }, { status: 500 });
  }
};

export const GET = withAuth(
  withRole(['Owner', 'Manager'], getTenantByIdHandler)
);
