import { Room } from '../models/Room';
import { Bed } from '../models/Bed';
import { AppError } from '../utils/AppError';

export const createRoom = async (data: any, property_id: string) => {
  const existingRoom = await Room.findOne({ property_id, room_number: data.room_number });
  if (existingRoom) throw new AppError('Room number already exists in this property', 400);

  const room = new Room({
    property_id,
    room_number: data.room_number,
    floor:       data.floor,
    room_type:   data.room_type || 'Non-AC',
    capacity:    data.capacity  || 1,
    amenities:   data.amenities || []
  });
  await room.save();
  return room;
};

export const createBed = async (data: any, property_id: string) => {
  const room = await Room.findById(data.room_id);
  if (!room) throw new AppError('Room not found', 404);
  if (room.property_id.toString() !== property_id.toString())
    throw new AppError('Room does not belong to this property', 403);

  const existingBed = await Bed.findOne({ room_id: data.room_id, bed_identifier: data.bed_identifier });
  if (existingBed) throw new AppError('Bed identifier already exists in this room', 400);

  const bed = new Bed({
    property_id,
    room_id:        data.room_id,
    bed_identifier: data.bed_identifier,
    price:          data.price,
    status:         'Vacant'
  });
  await bed.save();
  return bed;
};
