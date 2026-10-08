import { getApiUrl } from '../config/api';
import { getAuthHeaders } from './authService';

/**
 * Product Service
 * Handle semua API calls yang berkaitan dengan products/menu
 */

export interface Product {
  productId: number;
  productName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface ProductCreateDto {
  productName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface ProductUpdateDto extends ProductCreateDto {
  productId: number;
}

/**
 * Get all products atau search products by keyword
 */
export const getAllProducts = async (search?: string): Promise<Product[]> => {
  const url = search 
    ? getApiUrl(`/api/products?search=${encodeURIComponent(search)}`)
    : getApiUrl('/api/products');
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(getApiUrl(`/api/products/${id}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Create new product (Admin only - requires JWT)
 */
export const createProduct = async (product: ProductCreateDto): Promise<Product> => {
  const response = await fetch(getApiUrl('/api/products'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create product: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Update existing product (Admin only - requires JWT)
 */
export const updateProduct = async (product: ProductUpdateDto): Promise<Product> => {
  const response = await fetch(getApiUrl(`/api/products/${product.productId}`), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update product: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Delete product (Admin only - requires JWT)
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(getApiUrl(`/api/products/${productId}`), {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
};

/**
 * Upload product image (Admin only - requires JWT)
 */
export const uploadProductImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('admin_token');
  const response = await fetch(getApiUrl('/api/products/upload-image'), {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }
  
  return response.json();
};
