import { apiRequest } from './client';

export interface DashboardData {
  total_tenants: number;
  total_beds: number;
  occupied_beds: number;
  vacant_beds: number;
  occupancy_rate: number;
  open_complaints: number;
  notice_period_tenants: number;
  summary: {
    total_invoiced: number;
    total_collected: number;
    unpaid_amount: number;
    pending_verification: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export async function getDashboard(month?: string): Promise<DashboardResponse> {
  const query = month ? `?month=${month}` : '';
  return apiRequest<DashboardResponse>(`/api/dashboard${query}`);
}
