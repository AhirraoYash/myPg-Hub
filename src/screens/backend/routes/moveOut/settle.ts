import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { generateSettlement } from '../../controllers/moveOutController';

const settleHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    
    // Extract notice_id from body (or URL params if mapped dynamically)
    const notice_id = context?.params?.id || body.notice_id;
    
    if (!notice_id) {
      return NextResponse.json({ error: 'Missing notice_id' }, { status: 400 });
    }

    const deductions = body.deductions || [];

    const settlement = await generateSettlement(notice_id, user.property_id, deductions);
    
    return NextResponse.json({
      message: 'Settlement generated successfully',
      data: settlement
    }, { status: 200 });
  } catch (error: any) {
    console.error('Generate Settlement Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate settlement' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Owner', 'Manager'], settleHandler)
);
