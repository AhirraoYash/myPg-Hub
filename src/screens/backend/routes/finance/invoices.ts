import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { generateInvoice } from '../../controllers/financeController';
import { getInvoices } from '../../controllers/financeQueryController';

const createInvoiceHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const property_id = user.property_id;

    if (!body.tenant_id || !body.billing_month || !body.due_date || !body.idempotency_key || !body.line_items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const invoice = await generateInvoice(body, property_id);

    return NextResponse.json({
      message: 'Invoice generated successfully',
      data: invoice
    }, { status: 201 });
  } catch (error: any) {
    console.error('Generate Invoice Error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Invoice with this idempotency key already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || 'Failed to generate invoice' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Owner', 'Manager'], createInvoiceHandler)
);

const getInvoicesHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getInvoices(user.property_id, user.role, user.user_id, status, page, limit);

    return NextResponse.json({
      message: 'Invoices fetched successfully',
      ...result
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Invoices Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch invoices' }, { status: 500 });
  }
};

export const GET = withAuth(getInvoicesHandler);
