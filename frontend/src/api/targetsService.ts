import { apiRequest } from './client';
import { CreateTargetRequest, TargetResponse } from './types';

export const targetsService = {
  getAll: () => apiRequest<TargetResponse[]>('/Targets'),
  
  create: (data: CreateTargetRequest) => 
    apiRequest<TargetResponse>('/Targets', {
      method: 'POST',
      body: data,
    }),
};