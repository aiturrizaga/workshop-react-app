import { apiClient } from '@/shared/api/apiClient';
import type { AuthUser, LoginRequest, LoginResponse } from '../types';
import type { ApiResponse } from '@/shared/types/api';

/**
 * Ya no llamamos a `fetch` directamente: apiClient centraliza la URL base,
 * los headers y el manejo de errores para todas las features.
 */
export const authService = {
  login(payload: LoginRequest) {
    return apiClient.post<LoginResponse>('/auth/login', payload);
  },
  me() {
    return apiClient.get<ApiResponse<AuthUser>>('/auth/me');
  },
};
