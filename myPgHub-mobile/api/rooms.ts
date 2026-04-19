import { apiRequest } from './client';

export interface Bed {
  _id: string;
  bed_identifier: string;
  price: number;
  status: 'Vacant' | 'Occupied' | 'Maintenance';
  tenant?: {
    _id: string;
    first_name: string;
    last_name: string;
    phone: string;
    joining_date?: string;
  };
}

export interface Room {
  _id: string;
  room_number: string;
  floor?: string;
  room_type?: string;
  capacity: number;
  amenities?: string[];
  beds: Bed[];
  property_id: string;
}

export interface RoomsResponse {
  success: boolean;
  data: Room[];
}

export interface RoomResponse {
  success: boolean;
  data: Room;
}

export interface BedResponse {
  success: boolean;
  data: Bed;
}

export async function getRooms(status?: string): Promise<RoomsResponse> {
  const query = status ? `?status=${status}` : '';
  return apiRequest<RoomsResponse>(`/api/rooms${query}`);
}

export async function createRoom(data: {
  room_number: string;
  floor?: string;
  room_type?: string;
  capacity: number;
  amenities?: string[];
}): Promise<RoomResponse> {
  return apiRequest<RoomResponse>('/api/rooms', {
    method: 'POST',
    body: data,
  });
}

export async function createBed(data: {
  room_id: string;
  bed_identifier: string;
  price: number;
}): Promise<BedResponse> {
  return apiRequest<BedResponse>('/api/beds', {
    method: 'POST',
    body: data,
  });
}
