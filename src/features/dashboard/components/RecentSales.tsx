import { ShoppingCart } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { SaleStatusBadge } from '@/features/sales/components/SaleStatusBadge';
import { useSales } from '@/features/sales/hooks/useSales';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';

/**
 * Reutiliza useSales (GET /sales o /sales/my-sales según el rol) mostrando
 * solo la primera página con pocos resultados: son datos reales, no mock.
 */
export function RecentSales() {
  const { sales, loading } = useSales({ page: 1, limit: 5 });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-slate-900">Ventas recientes</h2>
      </CardHeader>
      <CardBody>
        {loading && <Spinner label="Cargando ventas..." />}
        {!loading && sales.length === 0 && (
          <EmptyState icon={ShoppingCart} title="Aún no hay ventas." />
        )}
        {!loading && sales.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {sales.map((sale) => (
              <li key={sale.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{sale.customerName}</p>
                  <p className="text-xs text-slate-500">{formatDate(sale.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-medium text-slate-700">{formatCurrency(sale.total)}</span>
                  <SaleStatusBadge status={sale.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
