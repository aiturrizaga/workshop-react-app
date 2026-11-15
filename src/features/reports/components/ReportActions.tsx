import type { ReactNode } from 'react';
import { Eye, FileSpreadsheet, FileText, Printer, Sheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ReportAction } from '../hooks/useReportExport';
import type { ReportFormat } from '../types';

interface ReportActionsProps {
  /** Prefijo para identificar qué botón está generando (p. ej. "sales"). */
  reportKey: string;
  busyKey: string | null;
  disabled?: boolean;
  onAction: (format: ReportFormat, action: ReportAction, key: string) => void;
}

/**
 * Botonera de un reporte: vista previa / impresión del PDF y descarga en
 * los tres formatos. Mientras se genera un archivo, TODOS los botones de
 * ese reporte quedan bloqueados y el que se presionó muestra un spinner.
 */
export function ReportActions({ reportKey, busyKey, disabled, onAction }: ReportActionsProps) {
  const busy = busyKey?.startsWith(`${reportKey}:`) ?? false;
  const isBusy = (suffix: string) => busyKey === `${reportKey}:${suffix}`;

  const button = (
    suffix: string,
    label: string,
    icon: ReactNode,
    format: ReportFormat,
    action: ReportAction,
    variant: 'primary' | 'secondary' = 'secondary',
  ) => (
    <Button
      size="sm"
      variant={variant}
      icon={icon}
      loading={isBusy(suffix)}
      disabled={disabled || (busy && !isBusy(suffix))}
      onClick={() => onAction(format, action, `${reportKey}:${suffix}`)}
    >
      {label}
    </Button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {button('preview', 'Vista previa', <Eye className="size-4" />, 'pdf', 'preview')}
      {button('print', 'Imprimir', <Printer className="size-4" />, 'pdf', 'print')}
      {button('pdf', 'PDF', <FileText className="size-4" />, 'pdf', 'download', 'primary')}
      {button(
        'xlsx',
        'Excel',
        <FileSpreadsheet className="size-4" />,
        'xlsx',
        'download',
        'primary',
      )}
      {button('csv', 'CSV', <Sheet className="size-4" />, 'csv', 'download', 'primary')}
    </div>
  );
}
