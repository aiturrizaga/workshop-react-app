import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, ShoppingCart } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { TBody, TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import { SaleDetailModal } from '../components/SaleDetailModal';
import { SaleStatusBadge } from '../components/SaleStatusBadge';
import { useSales } from '../hooks/useSales';
import type { Sale } from '../types';

const PAGE_SIZE = 10;

export function SalesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { sales, meta, loading, error } = useSales({ page, limit: PAGE_SIZE });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        description="Historial de ventas registradas"
        actions={
          <Button
            icon={<Plus className="size-4" aria-hidden />}
            onClick={() => navigate('/sales/new')}
          >
            Nueva venta
          </Button>
        }
      />

      <Card>
        {loading && <Spinner label="Cargando ventas..." />}

        {!loading && error && (
          <div className="p-4">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        {!loading && !error && sales.length === 0 && (
          <EmptyState
            icon={ShoppingCart}
            title="No hay ventas registradas."
            description="Registra la primera venta del sistema."
          />
        )}

        {!loading && !error && sales.length > 0 && (
          <>
            <Table>
              <THead>
                <tr>
                  <TH>Cliente</TH>
                  <TH>Vendedor</TH>
                  <TH>Fecha</TH>
                  <TH>Total</TH>
                  <TH>Estado</TH>
                  <TH className="text-right">Acciones</TH>
                </tr>
              </THead>
              <TBody>
                {sales.map((sale) => (
                  <TR key={sale.id}>
                    <TD className="font-medium text-slate-900">{sale.customerName}</TD>
                    <TD>{sale.userName}</TD>
                    <TD>{formatDate(sale.createdAt)}</TD>
                    <TD>{formatCurrency(sale.total)}</TD>
                    <TD>
                      <SaleStatusBadge status={sale.status} />
                    </TD>
                    <TD>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Ver detalle de la venta"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <Eye className="size-4" aria-hidden />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {meta && <Pagination meta={meta} onPageChange={setPage} />}
          </>
        )}
      </Card>

      <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
}
