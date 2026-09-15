import { apiClient } from '@/shared/api/apiClient';
import type { LoginRequest, LoginResponse } from '../types';

/**
 * Ya no llamamos a `fetch` directamente: apiClient centraliza la URL base,
 * los headers y el manejo de errores para todas las features.
 */
export const authService = {
  login(payload: LoginRequest) {
    return apiClient.post<LoginResponse>('/auth/login', payload);
  },
};
