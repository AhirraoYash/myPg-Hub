import { apiRequest } from './client';

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  role: 'owner' | 'manager' | 'tenant';
  property_id: string;
  bed_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface MeResponse {
  success: boolean;
  data: User;
}

export async function login(phone: string, pin: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: { phone, pin },
    requiresAuth: false,
  });
}

export async function register(data: {
  phone: string;
  pin: string;
  first_name: string;
  last_name: string;
  pg_name: string;
  address: string;
}): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: data,
    requiresAuth: false,
  });
}

export async function getMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/api/auth/me');
}
