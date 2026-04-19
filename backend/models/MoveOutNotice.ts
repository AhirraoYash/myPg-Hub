import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface IDeduction {
  reason: string;
  amount: number;
}

export interface IMoveOutNotice extends Document {
  property_id: Types.ObjectId;
  tenant_id: Types.ObjectId;
  bed_id: Types.ObjectId;
  notice_date: Date;
  expected_move_out_date: Date;
  actual_move_out_date?: Date;
  status: 'Notice_Given' | 'Inspection_Pending' | 'Settlement_Generated' | 'Completed';
  deductions: IDeduction[];
  total_refund_calculated: number;
  createdAt: Date;
  updatedAt: Date;
}

const DeductionSchema = new Schema<IDeduction>({
  reason: { type: String, required: true },
  amount: { type: Number, required: true }
});

const MoveOutNoticeSchema = new Schema<IMoveOutNotice>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bed_id: { type: Schema.Types.ObjectId, ref: 'Bed', required: true },
    notice_date: { type: Date, default: Date.now },
    expected_move_out_date: { type: Date, required: true },
    actual_move_out_date: { type: Date },
    status: { 
      type: String, 
      enum: ['Notice_Given', 'Inspection_Pending', 'Settlement_Generated', 'Completed'], 
      default: 'Notice_Given' 
    },
    deductions: [DeductionSchema],
    total_refund_calculated: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes for fast querying by property/status and tenant/status
MoveOutNoticeSchema.index({ property_id: 1, status: 1 });
MoveOutNoticeSchema.index({ tenant_id: 1, status: 1 });

export const MoveOutNotice: Model<IMoveOutNotice> =
  (mongoose.models.MoveOutNotice as Model<IMoveOutNotice>) ||
  mongoose.model<IMoveOutNotice>('MoveOutNotice', MoveOutNoticeSchema);
