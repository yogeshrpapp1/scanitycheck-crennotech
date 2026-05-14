import { RegisterRequest, LoginRequest, AuthResponse } from './types';

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch('/api/Auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }

  return result as AuthResponse;
};

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch('/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }

  return result as AuthResponse;
};

export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  
  if (!token) {return;}

  try {
    await fetch('/api/Auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
  }
};