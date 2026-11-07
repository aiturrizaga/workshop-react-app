import { Badge } from '@/components/ui/Badge';
import type { SaleStatus } from '../types';

const STATUS_LABELS: Record<SaleStatus, string> = {
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  return (
    <Badge variant={status === 'COMPLETED' ? 'success' : 'danger'}>{STATUS_LABELS[status]}</Badge>
  );
}
