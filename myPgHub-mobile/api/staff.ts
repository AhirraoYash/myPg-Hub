import { apiRequest } from './client';

export interface Manager {
  _id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  is_active: boolean;
  created_at?: string;
}

export interface StaffResponse {
  success: boolean;
  data: Manager[];
}

export interface StaffMemberResponse {
  success: boolean;
  data: Manager;
}

export async function listStaff(): Promise<StaffResponse> {
  return apiRequest<StaffResponse>('/api/staff');
}

export async function addManager(data: {
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  pin: string;
}): Promise<StaffMemberResponse> {
  return apiRequest<StaffMemberResponse>('/api/staff', { method: 'POST', body: data });
}

export async function removeManager(userId: string): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/api/staff/${userId}`, { method: 'DELETE' });
}
