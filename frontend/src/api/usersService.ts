import { apiRequest } from './client';
import { UserResponse } from './types';

export const usersService = {
  getAll: () => apiRequest<UserResponse[]>('/Users'),
  
  updateRole: (id: number, role: string) => 
    apiRequest<void>(`/Users/${id}/role`, {
      method: 'PUT',
      body: { role },
    }),
};