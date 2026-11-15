import { Package, Receipt, ShoppingCart, Wallet } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import type { AsyncSection } from '../hooks/useDashboardCharts';
import type { DashboardKpis } from '../types';
import { DashboardStatCard } from './DashboardStatCard';

/** KPIs del rango: arriba, grandes y en una fila. Se leen en 5 segundos. */
export function KpiRow({ section }: { section: AsyncSection<DashboardKpis> }) {
  if (section.loading) return <Spinner label="Cargando indicadores..." />;
  if (section.error) return <Alert variant="danger">{section.error}</Alert>;
  if (!section.data) return null;

  const kpis = section.data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        icon={Wallet}
        label="Ingresos del periodo"
        value={formatCurrency(kpis.revenue)}
        hint="Solo ventas completadas"
      />
      <DashboardStatCard
        icon={ShoppingCart}
        label="Ventas"
        value={String(kpis.salesCount)}
        hint={kpis.cancelledCount > 0 ? `${kpis.cancelledCount} anuladas` : 'Sin anulaciones'}
      />
      <DashboardStatCard
        icon={Receipt}
        label="Ticket promedio"
        value={formatCurrency(kpis.averageTicket)}
      />
      <DashboardStatCard icon={Package} label="Unidades vendidas" value={String(kpis.unitsSold)} />
    </div>
  );
}
