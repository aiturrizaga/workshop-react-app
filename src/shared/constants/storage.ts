/**
 * Claves usadas para persistir la sesión en localStorage.
 * Centralizadas aquí para que apiClient y AuthContext usen exactamente
 * la misma clave sin depender uno del otro.
 */
export const AUTH_TOKEN_STORAGE_KEY = 'sales-system:accessToken';
