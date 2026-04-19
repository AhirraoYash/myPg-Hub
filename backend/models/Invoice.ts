import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface ILineItem {
  description: string;
  amount: number;
  type: 'Rent' | 'Late_Fee' | 'Damage' | 'Other';
}

export interface IInvoice extends Document {
  property_id: Types.ObjectId;
  tenant_id: Types.ObjectId;
  billing_month: string; // e.g., 'May-2026'
  due_date: Date;
  status: 'Unpaid' | 'Partial' | 'Payment_Under_Review' | 'Paid';
  idempotency_key: string;
  line_items: ILineItem[];
  total_amount: number; // Cached total of line_items
  amount_paid: number;  // Cached total of successful payments
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema<ILineItem>({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  type: { 
    type: String, 
    enum: ['Rent', 'Late_Fee', 'Damage', 'Other'], 
    required: true 
  }
}, { _id: false }); // No need for separate ObjectIds for line items

const InvoiceSchema = new Schema<IInvoice>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    billing_month: { type: String, required: true },
    due_date: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Unpaid', 'Partial', 'Payment_Under_Review', 'Paid'], 
      default: 'Unpaid' 
    },
    idempotency_key: { type: String, required: true, unique: true },
    line_items: [LineItemSchema],
    total_amount: { type: Number, required: true, default: 0 },
    amount_paid: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

// ==========================================
// Indexes for Fast Financial Reporting
// ==========================================
// 1. Multi-tenant isolation & tenant lookups
InvoiceSchema.index({ property_id: 1, tenant_id: 1 });
// 2. Fast querying for unpaid/pending invoices per property
InvoiceSchema.index({ property_id: 1, status: 1 });
// 3. Monthly revenue reporting
InvoiceSchema.index({ property_id: 1, billing_month: 1 });
// 4. Strict idempotency constraint (Prevents double-billing cron bugs)
InvoiceSchema.index({ idempotency_key: 1 }, { unique: true });

export const Invoice: Model<IInvoice> =
  (mongoose.models.Invoice as Model<IInvoice>) ||
  mongoose.model<IInvoice>('Invoice', InvoiceSchema);
