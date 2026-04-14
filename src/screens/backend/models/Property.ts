import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  owner_id: Types.ObjectId;
  subscription_plan: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  settings: {
    default_rent_due_date: number; // e.g., 1 for the 1st of the month
    late_fee_amount: number;
    notice_period_days: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true },
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscription_plan: { 
      type: String, 
      enum: ['Free', 'Basic', 'Premium', 'Enterprise'], 
      default: 'Free' 
    },
    settings: {
      default_rent_due_date: { type: Number, default: 1, min: 1, max: 28 },
      late_fee_amount: { type: Number, default: 0 },
      notice_period_days: { type: Number, default: 30 }
    }
  },
  { timestamps: true }
);

PropertySchema.index({ owner_id: 1 });

export const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
