import { getApiUrl } from '../config/api';
import { getAuthHeaders } from './authService';

/**
 * Order Service
 * Handle semua API calls yang berkaitan dengan orders
 */

export interface OrderItem {
  namaProduk: string;
  quantity: number;
  price: number;
  notes: string | null;
}

export interface Order {
  orderId: number;
  tableNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  additionalNotes: string | null;
  itemsBeli: OrderItem[];
}

export interface OrderCreateDto {
  tableNumber: string;
  customerName: string;
  additionalNotes?: string;
  cartItems: {
    productId: number;
    quantity: number;
    notes?: string;
  }[];
}

export interface OrderReceipt {
  noNota: string;
  namaResto: string;
  alamat: string;
  meja: string;
  pelanggan: string;
  waktuCetak: string;
  totalBayar: number;
  itemBelanja: {
    menu: string;
    quantity: number;
    hargaSatuan: number;
    subTotal: number;
  }[];
}

/**
 * Get all orders atau search by keyword (Admin only - requires JWT)
 */
export const getAllOrders = async (search?: string): Promise<Order[]> => {
  const url = search
    ? getApiUrl(`/api/orders?search=${encodeURIComponent(search)}`)
    : getApiUrl('/api/orders');
  
  const token = localStorage.getItem('admin_token');
  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await fetch(getApiUrl(`/api/orders?search=${orderId}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }
  
  const orders = await response.json();
  
  if (!orders || orders.length === 0) {
    throw new Error('Order not found');
  }
  
  return orders[0];
};

/**
 * Create new order
 */
export const createOrder = async (orderData: OrderCreateDto): Promise<{ orderId: number }> => {
  const response = await fetch(getApiUrl('/api/orders'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create order: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Mark order as "Lunas" (paid) - Admin only - requires JWT
 */
export const markOrderAsLunas = async (orderId: number): Promise<void> => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(getApiUrl(`/api/orders/${orderId}/lunas`), {
    method: 'PUT',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to mark order as lunas: ${response.statusText}`);
  }
};

/**
 * Get order receipt/struk
 */
export const getOrderReceipt = async (orderId: number): Promise<OrderReceipt> => {
  const response = await fetch(getApiUrl(`/api/orders/${orderId}/struk`));
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get receipt: ${response.statusText}`);
  }
  
  return response.json();
};
