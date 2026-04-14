import mongoose from 'mongoose';
import { Invoice, ILineItem } from '../models/Invoice';
import { Payment } from '../models/Payment';

export interface GenerateInvoiceData {
  tenant_id: string;
  billing_month: string;
  due_date: string | Date;
  idempotency_key: string;
  line_items: ILineItem[];
}

export const generateInvoice = async (data: GenerateInvoiceData, property_id: string) => {
  const { tenant_id, billing_month, due_date, idempotency_key, line_items } = data;

  // Calculate total amount from line items
  const total_amount = line_items.reduce((sum, item) => sum + item.amount, 0);

  const invoice = new Invoice({
    property_id,
    tenant_id,
    billing_month,
    due_date: new Date(due_date),
    idempotency_key,
    line_items,
    total_amount,
    amount_paid: 0,
    status: 'Unpaid'
  });

  await invoice.save();
  return invoice;
};

export interface RecordPaymentData {
  invoice_id: string;
  tenant_id: string;
  amount: number;
  payment_method: 'Cash' | 'UPI' | 'Card' | 'Bank_Transfer';
  transaction_id?: string;
  notes?: string;
}

export const recordPayment = async (data: RecordPaymentData, manager_id: string, property_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invoice_id, tenant_id, amount, payment_method, transaction_id, notes } = data;

    const invoice = await Invoice.findById(invoice_id).session(session);
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.property_id.toString() !== property_id.toString()) {
      throw new Error('Invoice does not belong to this property');
    }

    const isCash = payment_method === 'Cash';
    const paymentStatus = isCash ? 'Pending_Verification' : 'Completed';

    const payment = new Payment({
      invoice_id,
      property_id,
      tenant_id,
      amount,
      payment_method,
      status: paymentStatus,
      recorded_by: isCash ? manager_id : undefined, // Log manager_id for cash payments
      transaction_id,
      notes
    });

    await payment.save({ session });

    if (isCash) {
      // Force invoice status to Payment_Under_Review for Cash
      invoice.status = 'Payment_Under_Review';
    } else {
      // For online payments, update amount and status immediately
      invoice.amount_paid += amount;
      if (invoice.amount_paid >= invoice.total_amount) {
        invoice.status = 'Paid';
      } else {
        invoice.status = 'Partial';
      }
    }

    await invoice.save({ session });
    await session.commitTransaction();
    return payment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const verifyCashPayment = async (payment_id: string, property_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findById(payment_id).session(session);
    if (!payment) throw new Error('Payment not found');
    if (payment.property_id.toString() !== property_id.toString()) {
      throw new Error('Payment does not belong to this property');
    }
    if (payment.status !== 'Pending_Verification') {
      throw new Error('Payment is not pending verification');
    }

    // Update payment status
    payment.status = 'Completed';
    await payment.save({ session });

    // Update linked invoice
    const invoice = await Invoice.findById(payment.invoice_id).session(session);
    if (!invoice) throw new Error('Linked invoice not found');

    invoice.amount_paid += payment.amount;
    if (invoice.amount_paid >= invoice.total_amount) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Partial';
    }

    await invoice.save({ session });
    await session.commitTransaction();
    return { payment, invoice };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
