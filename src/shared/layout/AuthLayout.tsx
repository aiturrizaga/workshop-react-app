import { Outlet } from 'react-router-dom';

/**
 * Layout de las páginas públicas (login). Hoy solo delega en <Outlet />,
 * pero mantenerlo separado permite agregar en el futuro más pantallas
 * públicas (recuperar contraseña, registro, etc.) sin tocar el routing.
 */
export function AuthLayout() {
  return <Outlet />;
}
