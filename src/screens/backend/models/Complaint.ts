import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComplaint extends Document {
  property_id: Types.ObjectId;
  tenant_id: Types.ObjectId;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Cleaning' | 'WiFi' | 'Other';
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In_Progress' | 'Resolved';
  resolution_cost: number;
  resolved_by?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Plumbing', 'Electrical', 'Cleaning', 'WiFi', 'Other'], 
      required: true 
    },
    urgency: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Open', 'In_Progress', 'Resolved'], 
      default: 'Open' 
    },
    resolution_cost: { type: Number, default: 0 },
    resolved_by: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Indexes for fast querying
// 1. Manager filtering by property and status
ComplaintSchema.index({ property_id: 1, status: 1 });
// 2. Tenant fetching their own complaints
ComplaintSchema.index({ property_id: 1, tenant_id: 1 });

export const Complaint = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
