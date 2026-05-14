import { apiRequest } from './client';

// Backend enum: Queued | Running | Completed | Failed.
// The brief also uses "Pending" — we treat Queued as Pending in the UI.
export type ScanStatus = 'Queued' | 'Running' | 'Completed' | 'Failed';

export type ScanTool = 'ZAP' | 'Nuclei' | 'ZAP+Nuclei' | 'Both' | 'Simulated';

export interface ScanListItem {
  id: number;
  targetId: number;
  targetName: string;
  productName: string | null;
  environment: string;
  startedByUserId: number;
  tool: string;
  scope: string;
  status: string; // raw string from the API — narrow with isScanStatus()
  startedAt: string;
  completedAt: string | null;
  summary: string | null;
}

export interface StartScanRequest {
  targetId: number;
  tool: ScanTool;
  scope: string;
}

export interface StartScanResponse {
  message: string;
  scanId: number;
}

export function isScanStatus(value: string): value is ScanStatus {
  return value === 'Queued' || value === 'Running' || value === 'Completed' || value === 'Failed';
}

export async function listScans(signal?: AbortSignal): Promise<ScanListItem[]> {
  return apiRequest<ScanListItem[]>('/scans', { signal });
}

export async function startScan(payload: StartScanRequest): Promise<StartScanResponse> {
  return apiRequest<StartScanResponse>('/scans/start', {
    method: 'POST',
    body: {
      TargetId: payload.targetId,
      Tool: payload.tool,
      Scope: payload.scope,
    },
  });
}
