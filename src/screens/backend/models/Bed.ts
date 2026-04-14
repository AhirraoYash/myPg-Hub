import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBed extends Document {
  property_id: Types.ObjectId;
  room_id: Types.ObjectId;
  bed_identifier: string; // e.g., 'A', 'B', '1', '2'
  status: 'Vacant' | 'Occupied' | 'Maintenance';
  price: number;
  version: number; // Explicit version key for Optimistic Locking
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema = new Schema<IBed>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    room_id: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    bed_identifier: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Vacant', 'Occupied', 'Maintenance'], 
      default: 'Vacant' 
    },
    price: { type: Number, required: true }
  },
  { 
    timestamps: true,
    optimisticConcurrency: true, // Enables Mongoose Optimistic Locking
    versionKey: 'version'        // Overrides default '__v' to 'version'
  }
);

BedSchema.index({ property_id: 1, room_id: 1 });
BedSchema.index({ property_id: 1, status: 1 });
BedSchema.index({ room_id: 1, bed_identifier: 1 }, { unique: true });

export const Bed = mongoose.models.Bed || mongoose.model<IBed>('Bed', BedSchema);
