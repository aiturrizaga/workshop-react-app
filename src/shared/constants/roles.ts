/**
 * Roles soportados por el backend (enum UserRole de Prisma).
 * Se modela como union de strings en vez de un TS `enum`: es más simple,
 * se serializa igual que el JSON del backend y no genera código en runtime.
 */
export type UserRole = 'ADMIN' | 'SELLER';

export const USER_ROLES: UserRole[] = ['ADMIN', 'SELLER'];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  SELLER: 'Vendedor',
};
