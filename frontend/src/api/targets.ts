import { apiRequest } from './client';

export interface TargetListItem {
  id: number;
  name: string;
  baseUrl: string;
  openApiUrl: string | null;
  requiresAuth: boolean;
  clientName: string | null;
  productName: string | null;
  environment: string;
  notes: string | null;
  createdByUserId: number;
  createdAt: string;
}

export async function listTargets(signal?: AbortSignal): Promise<TargetListItem[]> {
  return apiRequest<TargetListItem[]>('/targets', { signal });
}
