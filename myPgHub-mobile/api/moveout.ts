import { apiRequest } from './client';

export interface MoveOutNotice {
  _id: string;
  tenant_id: string;
  property_id: string;
  notice_date: string;
  expected_move_out_date: string;
  status: 'Notice_Given' | 'Inspection_Pending' | 'Settlement_Generated' | 'Completed';
  settlement?: {
    deposit_amount: number;
    deductions: number;
    refund_amount: number;
  };
  tenant?: { first_name: string; last_name: string; phone: string };
  room_number?: string;
  bed_identifier?: string;
}

export interface NoticesResponse {
  success: boolean;
  data: MoveOutNotice[];
}

export interface NoticeResponse {
  success: boolean;
  data: MoveOutNotice;
}

export async function submitMoveOutNotice(): Promise<NoticeResponse> {
  return apiRequest<NoticeResponse>('/api/moveout/notice', { method: 'POST', body: {} });
}

export async function listNotices(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<NoticesResponse> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const query = q.toString() ? `?${q.toString()}` : '';
  return apiRequest<NoticesResponse>(`/api/moveout/notices${query}`);
}

export async function generateSettlement(notice_id: string): Promise<NoticeResponse> {
  return apiRequest<NoticeResponse>('/api/moveout/settlement', {
    method: 'POST',
    body: { notice_id },
  });
}

export async function completeMoveOut(notice_id: string): Promise<NoticeResponse> {
  return apiRequest<NoticeResponse>('/api/moveout/complete', {
    method: 'POST',
    body: { notice_id },
  });
}
