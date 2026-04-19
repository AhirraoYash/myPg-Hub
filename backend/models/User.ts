import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  pin_hash: string;
  first_name: string;
  last_name: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone:      { type: String, required: true, unique: true },
    pin_hash:   { type: String, required: true },
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    email:      { type: String, lowercase: true, sparse: true }
  },
  { timestamps: true }
);

UserSchema.index({ phone: 1 });

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
