import { Package, ShoppingCart, Users, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { DashboardStatCard } from '../components/DashboardStatCard';
import { DashboardTabs } from '../components/DashboardTabs';
import { LowStockProducts } from '../components/LowStockProducts';
import { RecentSales } from '../components/RecentSales';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const { data, loading, error } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general del negocio. Usa las pestañas para ver los gráficos del periodo con cada librería."
      />

      <DashboardTabs />

      {loading && <Spinner label="Cargando métricas..." />}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStatCard
              icon={ShoppingCart}
              label="Ventas hoy"
              value={String(data.sales.today)}
              hint={`${data.sales.month} este mes`}
            />
            <DashboardStatCard
              icon={Wallet}
              label="Ingresos del mes"
              value={formatCurrency(data.sales.monthTotal)}
            />
            <DashboardStatCard
              icon={Package}
              label="Productos"
              value={String(data.products.total)}
              hint={`${data.products.active} activos`}
            />
            <DashboardStatCard
              icon={Users}
              label="Clientes"
              value={String(data.customers.total)}
              hint={`${data.customers.active} activos`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentSales />
            <LowStockProducts />
          </div>
        </>
      )}
    </div>
  );
}
