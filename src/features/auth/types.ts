import type { User } from '@/features/users/types';

/**
 * El "user" que devuelve POST /auth/login es un subconjunto de User
 * (no incluye active/createdAt/updatedAt). GET /auth/me sí devuelve el
 * User completo, que también es compatible con este tipo.
 */
export type AuthUser = Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'role'>;

export interface LoginRequest {
  email: string;
  password: string;
}

/** Respuesta de POST /api/auth/login (sin envoltura "data"). */
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
