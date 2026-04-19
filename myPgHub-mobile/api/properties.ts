import { apiRequest } from './client';

export interface PropertySettings {
  _id: string;
  name: string;
  address?: string;
  upi_id?: string;
  owner_id: string;
  notice_period_days?: number;
  services?: string[];
  settings: {
    default_rent_due_date: number;
    late_fee_amount: number;
    notice_period_days: number;
    deposit_amount: number;
  };
}

export interface PropertyResponse {
  success: boolean;
  data: PropertySettings;
}

export async function getPropertySettings(): Promise<PropertyResponse> {
  return apiRequest<PropertyResponse>('/api/properties/settings');
}

export async function updatePropertySettings(data: {
  name?: string;
  address?: string;
  upi_id?: string;
  notice_period_days?: number;
  services?: string[];
  settings?: Partial<PropertySettings['settings']>;
}): Promise<PropertyResponse> {
  return apiRequest<PropertyResponse>('/api/properties/settings', { method: 'PATCH', body: data });
}

// Aliases for manage-property screen
export const getProperty = getPropertySettings;
export const updateProperty = updatePropertySettings;
