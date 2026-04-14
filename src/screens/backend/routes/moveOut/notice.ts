import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { submitNotice } from '../../controllers/moveOutController';

const submitNoticeHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const notice = await submitNotice(user.user_id, user.property_id);
    
    return NextResponse.json({
      message: 'Move-out notice submitted successfully',
      data: notice
    }, { status: 201 });
  } catch (error: any) {
    console.error('Submit Notice Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit notice' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Tenant'], submitNoticeHandler)
);
