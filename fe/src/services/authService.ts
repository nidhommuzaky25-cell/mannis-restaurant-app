import { getApiUrl } from '../config/api';

/**
 * Auth Service
 * Handle semua API calls yang berkaitan dengan authentication
 */

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

/**
 * Admin login
 */
export const login = async (credentials: LoginDto): Promise<LoginResponse> => {
  const response = await fetch(getApiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login gagal, periksa kembali akunmu.');
  }
  
  return response.json();
};

/**
 * Save auth token to localStorage
 */
export const saveAuthToken = (token: string, username: string): void => {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', username);
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('admin_user');
};

/**
 * Clear auth data (logout)
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Get authorization headers with JWT token
 * Use this for all authenticated API requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
