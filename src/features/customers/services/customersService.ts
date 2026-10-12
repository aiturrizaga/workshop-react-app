import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import type {
  Customer,
  CustomerQuery,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../types';

export const customersService = {
  list(query: CustomerQuery) {
    return apiClient.get<PaginatedResponse<Customer>>('/customers', query);
  },

  getById(id: string) {
    return apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
  },

  create(payload: CreateCustomerRequest) {
    return apiClient.post<ApiResponse<Customer>>('/customers', payload);
  },

  update(id: string, payload: UpdateCustomerRequest) {
    return apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete<ApiResponse<Customer>>(`/customers/${id}`);
  },
};
