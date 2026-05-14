export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
}

export interface CreateTargetRequest {
  name: string;
  baseUrl: string;
  openApiUrl?: string | null;
  requiresAuth: boolean;
  clientName?: string | null;
  productName?: string | null;
  environment: string;
  authHeader?: string | null;
  notes?: string | null;
}

export interface TargetResponse extends CreateTargetRequest {
  id: number;
  createdByUserId: number;
  createdAt: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}