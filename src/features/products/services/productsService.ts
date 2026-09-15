import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import type { CreateProductRequest, Product, ProductQuery, UpdateProductRequest } from '../types';

export const productsService = {
  list(query: ProductQuery) {
    return apiClient.get<PaginatedResponse<Product>>('/products', query);
  },

  getById(id: string) {
    return apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  },

  create(payload: CreateProductRequest) {
    return apiClient.post<ApiResponse<Product>>('/products', payload);
  },

  update(id: string, payload: UpdateProductRequest) {
    return apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload);
  },

  remove(id: string) {
    return apiClient.delete<ApiResponse<Product>>(`/products/${id}`);
  },
};
