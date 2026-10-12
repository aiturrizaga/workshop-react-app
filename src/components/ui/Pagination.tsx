import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@/shared/types/api';
import { Button } from './Button';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

/**
 * Paginación reutilizada por products, customers, sales y users.
 * Recibe el `meta` que devuelve el backend tal cual: { page, limit, total, totalPages }.
 */
export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = meta;

  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{from}</span> a{' '}
        <span className="font-medium text-slate-700">{to}</span> de{' '}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          icon={<ChevronLeft className="size-4" aria-hidden />}
        >
          Anterior
        </Button>
        <span className="text-sm text-slate-500">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
