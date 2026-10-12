import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NAV_ITEMS } from './navItems';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  onNavigate?: () => void;
}

/**
 * Contenido del sidebar, reutilizado tanto en el panel fijo de escritorio
 * (DashboardLayout) como dentro del Drawer en mobile.
 */
export function Sidebar({ onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const items = NAV_ITEMS.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(user!.role),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <ShoppingCart className="size-5" aria-hidden />
        </div>
        <span className="text-sm font-semibold text-slate-900">Ventas &amp; Inventario</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <SidebarItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}
