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
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get available months for chart
 */
export const getAvailableMonths = async (): Promise<AvailableMonth[]> => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/available-months`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch available months: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Get chart data (monthly or weekly)
 */
export const getChartData = async (
  year: number,
  view: 'monthly' | 'weekly',
  month?: number
): Promise<ChartPoint[]> => {
  const url = view === 'monthly'
    ? `${API_BASE_URL}/api/dashboard/chart?year=${year}&view=monthly`
    : `${API_BASE_URL}/api/dashboard/chart?year=${year}&month=${month}&view=weekly`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data: ${response.statusText}`);
  }
  
  return response.json();
};
