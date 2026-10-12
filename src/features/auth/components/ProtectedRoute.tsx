import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '@/shared/constants/roles';

interface ProtectedRouteProps {
  /** Si se indica, además de estar autenticado el usuario debe tener uno de estos roles. */
  allowedRoles?: UserRole[];
}

/**
 * Envuelve rutas privadas (ver app/router.tsx). Si el usuario no está
 * autenticado lo manda a /login. Si su rol no está permitido, lo manda
 * de vuelta a /home (el backend seguirá rechazando la petición igual;
 * esto solo mejora la experiencia de usuario, ver RolesGuard en el backend).
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, status, user } = useAuth();

  if (status === 'checking') {
    return <Spinner label="Cargando sesión..." className="min-h-screen" />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
