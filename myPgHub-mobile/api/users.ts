import { apiRequest } from './client';

export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
  email?: string;
}): Promise<{ success: boolean; data: any }> {
  return apiRequest('/api/users/profile', { method: 'PATCH', body: data });
}

export async function changePin(data: {
  old_pin: string;
  new_pin: string;
}): Promise<{ success: boolean; message: string }> {
  return apiRequest('/api/users/change-pin', { method: 'POST', body: data });
}
