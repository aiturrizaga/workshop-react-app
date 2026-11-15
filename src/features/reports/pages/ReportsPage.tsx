import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DateRangeFilter } from '@/features/dashboard/components/DateRangeFilter';
import { useDateRange } from '@/features/dashboard/hooks/useDateRange';
import { formatIsoDay } from '@/shared/utils/dateRange';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { ReportActions } from '../components/ReportActions';
import { useReportExport } from '../hooks/useReportExport';
import { reportsService } from '../services/reportsService';
import type { InventoryFilter } from '../types';

const INVENTORY_FILTERS: { value: InventoryFilter; label: string }[] = [
  { value: 'active', label: 'Solo productos activos' },
  { value: 'low-stock', label: 'Stock bajo (≤ 5 unidades)' },
  { value: 'all', label: 'Todos (incluye inactivos)' },
];

/**
 * Reportes: el usuario elige filtros y formato, el backend genera el
 * archivo y aquí solo se descarga, se previsualiza o se imprime.
 */
export function ReportsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { range, setRange } = useDateRange();
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>('active');
  const { busyKey, preview, run, closePreview } = useReportExport();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Documentos para compartir, imprimir o analizar en Excel. Los genera el servidor."
      />

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-slate-900">Reporte de ventas</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {isAdmin
              ? 'Todas las ventas del periodo, con cliente, vendedor, total y estado.'
              : 'Tus ventas del periodo, con cliente, total y estado.'}{' '}
            Máximo 366 días y 5000 ventas por reporte.
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <DateRangeFilter value={range} onChange={setRange} />
          <p className="text-sm text-slate-600">
            Periodo seleccionado:{' '}
            <span className="font-medium text-slate-900">
              {formatIsoDay(range.from)} al {formatIsoDay(range.to)}
            </span>
          </p>
          <ReportActions
            reportKey="sales"
            busyKey={busyKey}
            onAction={(format, action, key) =>
              run(key, action, () => reportsService.sales({ ...range, format }))
            }
          />
        </CardBody>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-900">Reporte de inventario</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Stock actual y valor del inventario (precio × stock). Solo administradores.
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="sm:w-72">
              <Label htmlFor="inventory-filter">Productos</Label>
              <Select
                id="inventory-filter"
                value={inventoryFilter}
                onChange={(event) => setInventoryFilter(event.target.value as InventoryFilter)}
              >
                {INVENTORY_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <ReportActions
              reportKey="inventory"
              busyKey={busyKey}
              onAction={(format, action, key) =>
                run(key, action, () =>
                  reportsService.inventory({ format, filter: inventoryFilter }),
                )
              }
            />
          </CardBody>
        </Card>
      )}

      <PdfPreviewModal preview={preview} onClose={closePreview} />
    </div>
  );
}
