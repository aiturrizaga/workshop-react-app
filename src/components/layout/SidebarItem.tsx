import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import type { NavItem } from './navItems';

interface SidebarItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

export function SidebarItem({ item, onNavigate }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        )
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      {item.label}
    </NavLink>
  );
}
