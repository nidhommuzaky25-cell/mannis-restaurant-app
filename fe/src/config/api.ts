/**
 * API Configuration
 * 
 * Menggunakan environment variable untuk API base URL
 * sehingga bisa di-customize untuk development atau production
 */

// Ambil base URL dari environment variable, atau fallback ke localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5029';

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
