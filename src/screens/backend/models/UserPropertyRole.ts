import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserPropertyRole extends Document {
  user_id: Types.ObjectId;
  property_id: Types.ObjectId;
  role: 'Owner' | 'Manager' | 'Tenant';
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserPropertyRoleSchema = new Schema<IUserPropertyRole>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    role: { 
      type: String, 
      enum: ['Owner', 'Manager', 'Tenant'], 
      required: true 
    },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Multi-tenant querying indexes
UserPropertyRoleSchema.index({ property_id: 1, user_id: 1 }, { unique: true });
UserPropertyRoleSchema.index({ property_id: 1, role: 1, is_active: 1 });
UserPropertyRoleSchema.index({ user_id: 1, is_active: 1 });

export const UserPropertyRole = mongoose.models.UserPropertyRole || mongoose.model<IUserPropertyRole>('UserPropertyRole', UserPropertyRoleSchema);
