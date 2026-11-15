import type { ReactNode } from 'react';
import { ChartNoAxesColumn } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { CHART_HEIGHT } from '../chartTheme';
import type { AsyncSection } from '../hooks/useDashboardCharts';

interface ChartCardProps<T> {
  /** La pregunta de negocio que responde el gráfico. */
  title: string;
  /** Unidades y periodo: "Soles · 01/11/2026 al 30/11/2026". */
  subtitle: string;
  section: AsyncSection<T[]>;
  /** Mensaje si no hay datos para el rango. */
  emptyMessage?: string;
  /** Considera "vacío" también cuando todos los valores son 0. */
  isEmpty?: (data: T[]) => boolean;
  children: (data: T[]) => ReactNode;
}

/**
 * Tarjeta estándar de gráfico con TODOS los estados: cargando, error,
 * vacío y datos. Cada tarjeta maneja su propio estado (no toda la página).
 */
export function ChartCard<T>({
  title,
  subtitle,
  section,
  emptyMessage = 'No hay datos para el periodo seleccionado.',
  isEmpty = (data) => data.length === 0,
  children,
}: ChartCardProps<T>) {
  return (
    <Card className="min-w-0 break-inside-avoid">
      <CardHeader>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </CardHeader>
      <CardBody>
        <div style={{ minHeight: CHART_HEIGHT }} className="flex flex-col justify-center">
          {section.loading && <Spinner label="Cargando gráfico..." />}
          {!section.loading && section.error && <Alert variant="danger">{section.error}</Alert>}
          {!section.loading && !section.error && section.data && isEmpty(section.data) && (
            <EmptyState icon={ChartNoAxesColumn} title={emptyMessage} />
          )}
          {!section.loading &&
            !section.error &&
            section.data &&
            !isEmpty(section.data) &&
            children(section.data)}
        </div>
      </CardBody>
    </Card>
  );
}
