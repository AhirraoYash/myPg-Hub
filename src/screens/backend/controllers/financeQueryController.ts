import { Invoice } from '../models/Invoice';
import { Payment } from '../models/Payment';

export const getInvoices = async (property_id: string, role: string, user_id: string, statusFilter?: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const query: any = { property_id };

  if (role === 'Tenant') {
    query.tenant_id = user_id;
  }
  if (statusFilter) {
    query.status = statusFilter;
  }

  const invoices = await Invoice.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('tenant_id', 'first_name last_name email')
    .lean();

  const total = await Invoice.countDocuments(query);

  return {
    data: invoices,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getPayments = async (property_id: string, role: string, user_id: string, tenant_id?: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const query: any = { property_id };

  if (role === 'Tenant') {
    query.tenant_id = user_id;
  } else if (tenant_id) {
    // Managers/Owners can filter by tenant
    query.tenant_id = tenant_id;
  }

  const payments = await Payment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('tenant_id', 'first_name last_name email')
    .populate('invoice_id', 'billing_month total_amount')
    .lean();

  const total = await Payment.countDocuments(query);

  return {
    data: payments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
