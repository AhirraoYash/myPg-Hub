import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBedAssignmentHistory extends Document {
  property_id: Types.ObjectId;
  tenant_id: Types.ObjectId;
  bed_id: Types.ObjectId;
  start_date: Date;
  end_date: Date | null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BedAssignmentHistorySchema = new Schema<IBedAssignmentHistory>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bed_id: { type: Schema.Types.ObjectId, ref: 'Bed', required: true },
    start_date: { type: Date, required: true, default: Date.now },
    end_date: { type: Date, default: null },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Indexes for fast multi-tenant lookups and historical queries
BedAssignmentHistorySchema.index({ property_id: 1, is_active: 1 });
BedAssignmentHistorySchema.index({ property_id: 1, tenant_id: 1, is_active: 1 });
BedAssignmentHistorySchema.index({ bed_id: 1, is_active: 1 });
// Ensure a tenant can only have one active bed assignment per property at a time
BedAssignmentHistorySchema.index(
  { property_id: 1, tenant_id: 1 }, 
  { unique: true, partialFilterExpression: { is_active: true } }
);
// Ensure a bed can only have one active tenant at a time
BedAssignmentHistorySchema.index(
  { bed_id: 1 }, 
  { unique: true, partialFilterExpression: { is_active: true } }
);

export const BedAssignmentHistory = mongoose.models.BedAssignmentHistory || mongoose.model<IBedAssignmentHistory>('BedAssignmentHistory', BedAssignmentHistorySchema);
