import { Printer } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatIsoDay } from '@/shared/utils/dateRange';
import { useDashboardCharts } from '../hooks/useDashboardCharts';
import { useDateRange } from '../hooks/useDateRange';
import { CHART_LIBRARIES } from '../libraries';
import type { DashboardChartSet } from '../types';
import { ChartCard } from './ChartCard';
import { DashboardTabs } from './DashboardTabs';
import { DateRangeFilter } from './DateRangeFilter';
import { KpiRow } from './KpiRow';

interface LibraryDashboardProps {
  libraryId: string;
  charts: DashboardChartSet;
}

/**
 * Estructura común de las páginas de cada librería:
 *   1. KPIs (arriba, en una fila)
 *   2. Tendencias y comparaciones (gráficos)
 *   3. Composición y relación
 * Todas usan los mismos datos (ya agregados por el backend); solo cambia
 * el componente de gráfico que se pasa en `charts`.
 */
export function LibraryDashboard({ libraryId, charts }: LibraryDashboardProps) {
  const { user } = useAuth();
  const { range, setRange } = useDateRange();
  const { kpis, salesByDay, topProducts, salesBySeller, performance } = useDashboardCharts(range);
  const library = CHART_LIBRARIES.find((item) => item.id === libraryId);
  const period = `${formatIsoDay(range.from)} al ${formatIsoDay(range.to)}`;
  const scope = user?.role === 'SELLER' ? 'Solo tus ventas' : 'Todo el negocio';

  const { SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart } = charts;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Dashboard · ${library?.name ?? libraryId}`}
        description={`${library?.description ?? ''} Paquete: ${library?.packageName ?? ''}`}
        actions={
          <Button
            variant="secondary"
            icon={<Printer className="size-4" />}
            onClick={() => window.print()}
            className="print:hidden"
          >
            Imprimir
          </Button>
        }
      />

      <DashboardTabs />

      <div className="print:hidden">
        <DateRangeFilter value={range} onChange={setRange} />
      </div>
      <p className="hidden text-sm text-slate-500 print:block">
        Periodo: {period} · {scope}
      </p>

      <KpiRow section={kpis} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 print:grid-cols-1">
        <ChartCard
          title="¿Cómo evolucionan los ingresos por día?"
          subtitle={`Soles por día · ${period} · ${scope}`}
          section={salesByDay}
          isEmpty={(data) => data.every((day) => day.total === 0)}
        >
          {(data) => <SalesByDayChart data={data} />}
        </ChartCard>

        <ChartCard
          title="¿Qué productos vendieron más?"
          subtitle={`Top 5 por ingresos (soles) · ${period}`}
          section={topProducts}
        >
          {(data) => <TopProductsChart data={data} />}
        </ChartCard>

        <ChartCard
          title="¿Qué parte de los ingresos aporta cada vendedor?"
          subtitle={`Participación en soles · ${period}`}
          section={salesBySeller}
        >
          {(data) => <SalesBySellerChart data={data} />}
        </ChartCard>

        <ChartCard
          title="¿El precio influye en las unidades vendidas?"
          subtitle={`Precio (S/) vs. unidades vendidas por producto activo · ${period}`}
          section={performance}
        >
          {(data) => <ProductPerformanceChart data={data} />}
        </ChartCard>
      </div>
    </div>
  );
}
