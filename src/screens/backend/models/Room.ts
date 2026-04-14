import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRoom extends Document {
  property_id: Types.ObjectId;
  room_number: string;
  floor: string;
  room_type: 'AC' | 'Non-AC';
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    room_number: { type: String, required: true },
    floor: { type: String, required: true },
    room_type: { type: String, enum: ['AC', 'Non-AC'], required: true }
  },
  { timestamps: true }
);

RoomSchema.index({ property_id: 1, room_number: 1 }, { unique: true });

export const Room = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
