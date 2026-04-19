import { Room } from '../models/Room';
import { Bed } from '../models/Bed';

export const getRoomsWithBeds = async (property_id: string, statusFilter?: string) => {
  // 1. Fetch all rooms for the property
  const rooms = await Room.find({ property_id }).sort({ room_number: 1 }).lean();

  if (!rooms.length) {
    return [];
  }

  // 2. Fetch beds for these rooms
  const bedQuery: any = { property_id };
  if (statusFilter) {
    bedQuery.status = statusFilter;
  }

  const beds = await Bed.find(bedQuery).sort({ bed_identifier: 1 }).lean();

  // 3. Group beds by room_id
  const bedsByRoom = beds.reduce((acc: any, bed: any) => {
    const roomId = bed.room_id.toString();
    if (!acc[roomId]) {
      acc[roomId] = [];
    }
    acc[roomId].push(bed);
    return acc;
  }, {});

  // 4. Attach beds to rooms
  const roomsWithBeds = rooms.map((room: any) => ({
    ...room,
    beds: bedsByRoom[room._id.toString()] || []
  }));

  // If filtering by status (e.g., 'Vacant'), optionally filter out rooms that have 0 matching beds
  if (statusFilter) {
    return roomsWithBeds.filter(room => room.beds.length > 0);
  }

  return roomsWithBeds;
};
