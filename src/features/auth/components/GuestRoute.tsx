import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

/**
 * Envuelve rutas públicas como /login: si el usuario YA está autenticado,
 * lo redirige a /home en vez de mostrarle el formulario de login otra vez.
 */
export function GuestRoute() {
  const { isAuthenticated, status } = useAuth();

  if (status === 'checking') {
    return <Spinner label="Cargando sesión..." className="min-h-screen" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
