import { API_BASE_URL } from '../config/api';

/**
 * Dashboard Service  
 * Handle semua API calls yang berkaitan dengan dashboard statistics
 */

export interface RecentOrder {
  orderId: number;
  tableNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface ChartData {
  date: string;
  revenue: number;
}

export interface ChartPoint {
  label: string;
  revenue: number;
}

export interface AvailableMonth {
  year: number;
  month: number;
  label: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  productSold: number;
  recentOrders: RecentOrder[];
  revenueChart: ChartData[];
}

/**
 * Get dashboard statistics (Admin only - requires JWT)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get available months for chart (Admin only - requires JWT)
 */
export const getAvailableMonths = async (): Promise<AvailableMonth[]> => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`${API_BASE_URL}/api/dashboard/available-months`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch available months: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get chart data (monthly or weekly) - Admin only - requires JWT
 */
export const getChartData = async (
  year: number,
  view: 'monthly' | 'weekly',
  month?: number
): Promise<ChartPoint[]> => {
  const url = view === 'monthly'
    ? `${API_BASE_URL}/api/dashboard/chart?year=${year}&view=monthly`
    : `${API_BASE_URL}/api/dashboard/chart?year=${year}&month=${month}&view=weekly`;
  
  const token = localStorage.getItem('admin_token');
  const response = await fetch(url, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data: ${response.statusText}`);
  }
  
  return response.json();
};
