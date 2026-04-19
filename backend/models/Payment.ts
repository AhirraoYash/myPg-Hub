import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface IPayment extends Document {
  invoice_id: Types.ObjectId;
  property_id: Types.ObjectId;
  tenant_id: Types.ObjectId;
  amount: number;
  payment_method: 'Cash' | 'UPI' | 'Card' | 'Bank_Transfer';
  status: 'Pending_Verification' | 'Completed' | 'Failed';
  recorded_by?: Types.ObjectId; // Nullable for automated online payments
  transaction_id?: string;      // Razorpay/Stripe ID or UPI UTR number
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoice_id: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    payment_method: { 
      type: String, 
      enum: ['Cash', 'UPI', 'Card', 'Bank_Transfer'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Pending_Verification', 'Completed', 'Failed'], 
      default: 'Pending_Verification' 
    },
    recorded_by: { type: Schema.Types.ObjectId, ref: 'User' },
    transaction_id: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

// ==========================================
// Indexes for Fast Financial Reporting
// ==========================================
// 1. Fetching all payments for a specific invoice
PaymentSchema.index({ invoice_id: 1 });
// 2. Multi-tenant isolation & tenant payment history
PaymentSchema.index({ property_id: 1, tenant_id: 1 });
// 3. Manager auditing (How much cash did Manager X collect?)
PaymentSchema.index({ property_id: 1, recorded_by: 1, payment_method: 1 });
// 4. Owner verification queue (Find all unverified cash payments)
PaymentSchema.index({ property_id: 1, status: 1 });

export const Payment: Model<IPayment> =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>('Payment', PaymentSchema);
