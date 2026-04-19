import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface IRoom extends Document {
  property_id: Types.ObjectId;
  room_number: string;
  floor: string;
  room_type: 'AC' | 'Non-AC';
  capacity: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    room_number:  { type: String, required: true },
    floor:        { type: String, required: true },
    room_type:    { type: String, enum: ['AC', 'Non-AC'], default: 'Non-AC' },
    capacity:     { type: Number, default: 1, min: 1 },
    amenities:    { type: [String], default: [] }
  },
  { timestamps: true }
);

RoomSchema.index({ property_id: 1, room_number: 1 }, { unique: true });

export const Room: Model<IRoom> =
  (mongoose.models.Room as Model<IRoom>) ||
  mongoose.model<IRoom>('Room', RoomSchema);
