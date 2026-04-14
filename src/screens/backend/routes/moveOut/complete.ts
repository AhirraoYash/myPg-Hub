import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { completeMoveOut } from '../../controllers/moveOutController';

const completeHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    
    // Extract notice_id from body (or URL params if mapped dynamically)
    const notice_id = context?.params?.id || body.notice_id;
    
    if (!notice_id) {
      return NextResponse.json({ error: 'Missing notice_id' }, { status: 400 });
    }

    const result = await completeMoveOut(notice_id, user.property_id);
    
    return NextResponse.json({
      message: 'Move-out completed successfully',
      data: result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Complete Move-Out Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to complete move-out' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Owner'], completeHandler)
);
