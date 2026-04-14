import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { recordPayment } from '../../controllers/financeController';
import { getPayments } from '../../controllers/financeQueryController';

const recordPaymentHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const property_id = user.property_id;
    const user_id = user.user_id;

    if (!body.invoice_id || !body.tenant_id || !body.amount || !body.payment_method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payment = await recordPayment(body, user_id, property_id);

    return NextResponse.json({
      message: 'Payment recorded successfully',
      data: payment
    }, { status: 201 });
  } catch (error: any) {
    console.error('Record Payment Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Owner', 'Manager', 'Tenant'], recordPaymentHandler)
);

const getPaymentsHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const tenant_id = searchParams.get('tenant_id') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getPayments(user.property_id, user.role, user.user_id, tenant_id, page, limit);

    return NextResponse.json({
      message: 'Payments fetched successfully',
      ...result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Payments Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch payments' }, { status: 500 });
  }
};

export const GET = withAuth(getPaymentsHandler);
