import { apiRequest } from './client';

export interface Invoice {
  _id: string;
  tenant_id: string;
  property_id: string;
  billing_month: string;
  due_date: string;
  status: 'Unpaid' | 'Partial' | 'Payment_Under_Review' | 'Paid';
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  line_items: { description: string; amount: number; type: string }[];
  created_at: string;
  tenant?: { first_name: string; last_name: string; phone: string };
}

export interface Payment {
  _id: string;
  invoice_id: string;
  tenant_id: string;
  property_id: string;
  amount: number;
  payment_method: 'Cash' | 'UPI' | 'Bank_Transfer' | 'Cashfree';
  status: 'Pending_Verification' | 'Completed' | 'Failed';
  transaction_id?: string;
  notes?: string;
  created_at: string;
  tenant?: { first_name: string; last_name: string };
  invoice?: { billing_month: string };
}

export interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
}

export interface InvoiceResponse {
  success: boolean;
  data: Invoice;
}

export interface PaymentsResponse {
  success: boolean;
  data: Payment[];
}

export interface PaymentResponse {
  success: boolean;
  data: Payment;
}

export async function getInvoices(params?: {
  status?: string;
  tenant_id?: string;
  page?: number;
  limit?: number;
}): Promise<InvoicesResponse> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.tenant_id) q.set('tenant_id', params.tenant_id);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const query = q.toString() ? `?${q.toString()}` : '';
  return apiRequest<InvoicesResponse>(`/api/finance/invoices${query}`);
}

export async function createInvoice(data: {
  tenant_id: string;
  billing_month: string;
  due_date: string;
  idempotency_key: string;
  line_items: { description: string; amount: number; type: string }[];
}): Promise<InvoiceResponse> {
  return apiRequest<InvoiceResponse>('/api/finance/invoices', { method: 'POST', body: data });
}

export async function getPayments(params?: {
  tenant_id?: string;
  page?: number;
  limit?: number;
}): Promise<PaymentsResponse> {
  const q = new URLSearchParams();
  if (params?.tenant_id) q.set('tenant_id', params.tenant_id);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const query = q.toString() ? `?${q.toString()}` : '';
  return apiRequest<PaymentsResponse>(`/api/finance/payments${query}`);
}

export async function recordPayment(data: {
  invoice_id: string;
  tenant_id: string;
  amount: number;
  payment_method: 'Cash' | 'UPI' | 'Bank_Transfer';
  transaction_id?: string;
  notes?: string;
}): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>('/api/finance/payments', { method: 'POST', body: data });
}

export async function verifyCashPayment(payment_id: string): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>('/api/finance/verify-payment', {
    method: 'POST',
    body: { payment_id },
  });
}
