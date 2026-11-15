import { apiClient } from '@/shared/api/apiClient';
import type { ApiResponse, PaginatedResponse, PaginationQuery } from '@/shared/types/api';
import type { CreateUserRequest, UpdateUserRequest, User } from '../types';

/**
 * Capa de acceso a datos de Users. Cada función es una llamada HTTP directa
 * a un endpoint del backend: Page -> Hook -> Service (aquí) -> apiClient.
 */
export const usersService = {
  list(query: PaginationQuery) {
    return apiClient.get<PaginatedResponse<User>>('/users', query);
  },

  getById(id: string) {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  },

  create(payload: CreateUserRequest) {
    return apiClient.post<ApiResponse<User>>('/users', payload);
  },

  update(id: string, payload: UpdateUserRequest) {
    return apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload);
  },

  /** DELETE /api/users/:id es una desactivación lógica (active = false) en el backend. */
  remove(id: string) {
    return apiClient.delete<ApiResponse<User>>(`/users/${id}`);
  },
};
