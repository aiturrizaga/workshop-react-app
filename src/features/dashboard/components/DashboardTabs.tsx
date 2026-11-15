import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { CHART_LIBRARIES } from '../libraries';

const TABS = [
  { to: '/dashboard', label: 'Resumen' },
  ...CHART_LIBRARIES.map((library) => ({ to: `/dashboard/${library.id}`, label: library.name })),
];

/**
 * Pestañas para cambiar entre el resumen y las páginas de cada librería.
 * Conserva ?from&to para que el periodo no se pierda al cambiar de pestaña.
 */
export function DashboardTabs() {
  const { search } = useLocation();

  return (
    <nav
      aria-label="Librerías de gráficos"
      className="scrollbar-thin -mx-1 flex gap-1 overflow-x-auto border-b border-slate-200 px-1 print:hidden"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={`${tab.to}${search}`}
          end
          className={({ isActive }) =>
            cn(
              '-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
