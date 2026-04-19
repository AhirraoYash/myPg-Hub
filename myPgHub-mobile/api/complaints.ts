import { apiRequest } from './client';

export interface Complaint {
  _id: string;
  tenant_id: string;
  property_id: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'Cleaning' | 'WiFi' | 'Other';
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In_Progress' | 'Resolved' | 'Closed';
  created_at: string;
  updated_at: string;
  tenant?: { first_name: string; last_name: string; phone: string };
  room_number?: string;
}

export interface ComplaintsResponse {
  success: boolean;
  data: Complaint[];
}

export interface ComplaintResponse {
  success: boolean;
  data: Complaint;
}

export async function getComplaints(params?: { status?: string }): Promise<ComplaintsResponse> {
  const q = params?.status ? `?status=${params.status}` : '';
  return apiRequest<ComplaintsResponse>(`/api/complaints${q}`);
}

export async function createComplaint(data: {
  title: string;
  description: string;
  category: string;
  urgency: string;
}): Promise<ComplaintResponse> {
  return apiRequest<ComplaintResponse>('/api/complaints', { method: 'POST', body: data });
}

export async function updateComplaintStatus(
  id: string,
  status: string
): Promise<ComplaintResponse> {
  return apiRequest<ComplaintResponse>(`/api/complaints/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}
