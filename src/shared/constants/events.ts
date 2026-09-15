/**
 * Nombre del evento global disparado cuando el backend responde 401.
 * AuthContext lo escucha para cerrar la sesión y redirigir a /login,
 * sin que apiClient necesite conocer React ni el router.
 */
export const UNAUTHORIZED_EVENT = 'sales-system:unauthorized';
