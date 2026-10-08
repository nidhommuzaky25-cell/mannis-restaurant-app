/**
 * API Configuration
 * 
 * Menggunakan runtime config atau environment variable
 * Priority: window.APP_CONFIG > VITE_API_BASE_URL > localhost
 */

// Declare window type for TypeScript
declare global {
  interface Window {
    APP_CONFIG?: {
      API_BASE_URL: string;
    };
  }
}

// Get API base URL from runtime config or environment variable
export const API_BASE_URL = 
  window.APP_CONFIG?.API_BASE_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  'http://localhost:5029';

/**
 * Helper function untuk membuat full API URL
 * @param endpoint - API endpoint (contoh: '/api/products')
 * @returns Full URL (contoh: 'http://localhost:5029/api/products')
 */
export const getApiUrl = (endpoint: string): string => {
  // Pastikan endpoint dimulai dengan /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

/**
 * Helper untuk debugging - log API base URL saat development
 */
if (import.meta.env.DEV) {
  console.log('🔌 API Base URL:', API_BASE_URL);
}
