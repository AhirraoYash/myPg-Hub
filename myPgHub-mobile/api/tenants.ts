import { apiRequest } from './client';

export interface Tenant {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  property_id: string;
  bed_id?: string;
  joining_date?: string;
  is_active: boolean;
  kyc_verified?: boolean;
  room?: {
    _id: string;
    room_number: string;
  };
  bed?: {
    _id: string;
    bed_identifier: string;
    price: number;
  };
}

export async function verifyTenantKYC(tenantId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/tenants/${tenantId}/verify-kyc`, {
    method: 'PATCH',
  });
}

export interface TenantsResponse {
  success: boolean;
  data: Tenant[];
  pagination?: { page: number; limit: number; total: number };
}

export interface TenantResponse {
  success: boolean;
  data: Tenant;
}

export async function listTenants(page = 1, limit = 20): Promise<TenantsResponse> {
  return apiRequest<TenantsResponse>(`/api/tenants?page=${page}&limit=${limit}`);
}

export async function getTenant(id: string): Promise<TenantResponse> {
  return apiRequest<TenantResponse>(`/api/tenants/${id}`);
}

export async function onboardTenant(data: {
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  bed_id: string;
}): Promise<TenantResponse> {
  return apiRequest<TenantResponse>('/api/tenants/onboard', {
    method: 'POST',
    body: data,
  });
}
