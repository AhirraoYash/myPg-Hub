import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { onboardTenant } from '../../controllers/tenantController';

const onboardHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const property_id = user.property_id;

    // Basic validation
    if (!body.bed_id || !body.email || !body.first_name || !body.last_name || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields (bed_id, email, first_name, last_name, phone)' }, 
        { status: 400 }
      );
    }

    const result = await onboardTenant(body, property_id);

    return NextResponse.json({
      message: 'Tenant onboarded successfully',
      data: result
    }, { status: 201 });

  } catch (error: any) {
    console.error('Tenant Onboarding Error:', error);
    
    // Handle specific known errors (like concurrency or validation)
    if (error.name === 'VersionError') {
      return NextResponse.json({ 
        error: 'This bed was just booked by someone else. Please select another bed.' 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      error: error.message || 'Failed to onboard tenant' 
    }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Owner', 'Manager'], onboardHandler)
);
