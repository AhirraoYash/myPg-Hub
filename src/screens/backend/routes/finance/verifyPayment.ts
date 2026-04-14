import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { verifyCashPayment } from '../../controllers/financeController';

const verifyPaymentHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const property_id = user.property_id;

    if (!body.payment_id) {
      return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 });
    }

    const result = await verifyCashPayment(body.payment_id, property_id);

    return NextResponse.json({
      message: 'Payment verified successfully',
      data: result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to verify payment' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Owner'], verifyPaymentHandler)
);
