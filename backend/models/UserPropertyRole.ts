import mongoose, { Schema, Document, Types, Model } from 'mongoose';

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
    user_id:     { type: Schema.Types.ObjectId, ref: 'User',     required: true },
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

// Only ONE active role per user per property at a time (partial unique index)
UserPropertyRoleSchema.index(
  { property_id: 1, user_id: 1 },
  { unique: true, partialFilterExpression: { is_active: true } }
);
UserPropertyRoleSchema.index({ property_id: 1, role: 1, is_active: 1 });
UserPropertyRoleSchema.index({ user_id: 1, is_active: 1 });

export const UserPropertyRole: Model<IUserPropertyRole> =
  (mongoose.models.UserPropertyRole as Model<IUserPropertyRole>) ||
  mongoose.model<IUserPropertyRole>('UserPropertyRole', UserPropertyRoleSchema);
