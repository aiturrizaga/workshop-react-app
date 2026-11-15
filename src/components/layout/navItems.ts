import { FileText, LayoutDashboard, Package, ShoppingCart, Users, UserCog } from 'lucide-react';
import type { UserRole } from '@/shared/constants/roles';

export interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  /** Si se omite, el ítem es visible para cualquier rol autenticado. */
  allowedRoles?: UserRole[];
}

/** Fuente única de la navegación del sidebar (y del menú mobile). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Productos', to: '/products', icon: Package },
  { label: 'Clientes', to: '/customers', icon: Users },
  { label: 'Ventas', to: '/sales', icon: ShoppingCart },
  { label: 'Reportes', to: '/reports', icon: FileText },
  { label: 'Usuarios', to: '/users', icon: UserCog, allowedRoles: ['ADMIN'] },
];
