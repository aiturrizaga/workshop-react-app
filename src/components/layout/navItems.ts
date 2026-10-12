import { House, Package, Users } from 'lucide-react';
import type { UserRole } from '@/shared/constants/roles';

export interface NavItem {
  label: string;
  to: string;
  icon: typeof House;
  /** Si se omite, el ítem es visible para cualquier rol autenticado. */
  allowedRoles?: UserRole[];
}

/**
 * Fuente única de la navegación del sidebar (y del menú mobile).
 * Ventas y Usuarios se agregan en las sesiones 5 y 6, cuando esas
 * features existen.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', to: '/home', icon: House },
  { label: 'Productos', to: '/products', icon: Package },
  { label: 'Clientes', to: '/customers', icon: Users },
];
