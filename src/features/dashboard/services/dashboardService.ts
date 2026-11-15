import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse } from '@/shared/types/api';
import type {
  DashboardData,
  DashboardKpis,
  DateRange,
  ProductPerformance,
  SalesByDay,
  SalesBySeller,
  TopProduct,
} from '../types';

/**
 * El backend AGREGA, el frontend DIBUJA: cada método pide datos ya
 * calculados (nunca todas las ventas para sumarlas en el navegador).
 */
export const dashboardService = {
  get() {
    return apiClient.get<ApiResponse<DashboardData>>('/dashboard');
  },

  kpis(range: DateRange) {
    return apiClient.get<ApiResponse<DashboardKpis>>('/dashboard/kpis', range);
  },

  salesByDay(range: DateRange) {
    return apiClient.get<ApiResponse<SalesByDay[]>>('/dashboard/sales-by-day', range);
  },

  topProducts(range: DateRange, limit = 5) {
    return apiClient.get<ApiResponse<TopProduct[]>>('/dashboard/top-products', {
      ...range,
      limit,
    });
  },

  salesBySeller(range: DateRange) {
    return apiClient.get<ApiResponse<SalesBySeller[]>>('/dashboard/sales-by-seller', range);
  },

  productPerformance(range: DateRange) {
    return apiClient.get<ApiResponse<ProductPerformance[]>>(
      '/dashboard/product-performance',
      range,
    );
  },
};
