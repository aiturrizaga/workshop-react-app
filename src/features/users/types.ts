import type { UserRole } from '@/shared/constants/roles';

/** Coincide con UserResponseDto del backend (nunca incluye passwordHash). */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Cuerpo de POST /api/users (CreateUserDto). */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Cuerpo de PATCH /api/users/:id (UpdateUserDto): todo opcional. */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}
