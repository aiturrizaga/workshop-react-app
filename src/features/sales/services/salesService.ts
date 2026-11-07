import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import type { CreateSaleRequest, Sale, SaleQuery } from '../types';

export const salesService = {
  /** GET /api/sales: todas las ventas. El backend solo lo permite a ADMIN. */
  list(query: SaleQuery) {
    return apiClient.get<PaginatedResponse<Sale>>('/sales', query);
  },

  /** GET /api/sales/my-sales: ventas del usuario autenticado. */
  listMine(query: SaleQuery) {
    return apiClient.get<PaginatedResponse<Sale>>('/sales/my-sales', query);
  },

  getById(id: string) {
    return apiClient.get<ApiResponse<Sale>>(`/sales/${id}`);
  },

  /** POST /api/sales: registra la venta como transacción en el backend. */
  create(payload: CreateSaleRequest) {
    return apiClient.post<ApiResponse<Sale>>('/sales', payload);
  },
};
