import { House, Package, ShoppingCart, Users } from 'lucide-react';
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
 * Usuarios (y el Dashboard real) se agregan en la sesión 6.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', to: '/home', icon: House },
  { label: 'Productos', to: '/products', icon: Package },
  { label: 'Clientes', to: '/customers', icon: Users },
  { label: 'Ventas', to: '/sales', icon: ShoppingCart },
];
