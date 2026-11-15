import { formatCurrency } from '@/shared/utils/formatCurrency';
import type { SalesBySeller } from './types';

/**
 * Colores compartidos por TODAS las librerías para que los dashboards sean
 * comparables. Regla: un color por serie (no uno por barra) y rojo solo
 * para alertas.
 */
export const CHART_COLORS = {
  primary: '#4f46e5', // brand-600: ingresos
  secondary: '#0ea5e9', // sky-500: cantidad de ventas / unidades
  grid: '#e2e8f0', // slate-200
  axis: '#64748b', // slate-500
  alert: '#dc2626', // red-600
};

/** Paleta categórica para la dona (máximo 5 partes). */
export const CATEGORY_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#94a3b8'];

/** Alto estándar de los gráficos dentro de una ChartCard. */
export const CHART_HEIGHT = 280;

/** "S/ 1,500" sin decimales para ejes (los tooltips usan formatCurrency completo). */
export function formatCurrencyShort(value: number): string {
  return `S/ ${new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(value)}`;
}

export { formatCurrency };

export interface DonutSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}

/**
 * Una dona solo se lee bien con 2 a 5 partes: los vendedores a partir del
 * quinto se agrupan en "Otros".
 */
export function toDonutSlices(sellers: SalesBySeller[], maxSlices = 5): DonutSlice[] {
  const sorted = [...sellers].sort((a, b) => b.total - a.total);
  const visible = sorted.length > maxSlices ? sorted.slice(0, maxSlices - 1) : sorted;
  const rest = sorted.slice(visible.length);

  const slices = visible.map((seller, index) => ({
    id: seller.userId,
    label: seller.name,
    value: seller.total,
    color: CATEGORY_COLORS[index],
  }));

  if (rest.length > 0) {
    slices.push({
      id: 'others',
      label: `Otros (${rest.length})`,
      value: rest.reduce((sum, seller) => sum + seller.total, 0),
      color: CATEGORY_COLORS[CATEGORY_COLORS.length - 1],
    });
  }

  return slices;
}
