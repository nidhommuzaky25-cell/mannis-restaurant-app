import { getApiUrl } from '../config/api';

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
 * Create new product
 */
export const createProduct = async (product: ProductCreateDto): Promise<Product> => {
  const response = await fetch(getApiUrl('/api/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create product: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Update existing product
 */
export const updateProduct = async (product: ProductUpdateDto): Promise<Product> => {
  const response = await fetch(getApiUrl(`/api/products/${product.productId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update product: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Delete product
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  const response = await fetch(getApiUrl(`/api/products/${productId}`), {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
};

/**
 * Upload product image
 */
export const uploadProductImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(getApiUrl('/api/products/upload-image'), {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }
  
  return response.json();
};
