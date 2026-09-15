import type { TdHTMLAttributes, ThHTMLAttributes } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Envoltorios finos sobre <table> nativo con los estilos del sistema.
 * Mantiene la semántica HTML (accesibilidad, comportamiento nativo) en vez
 * de reinventar una tabla con divs.
 *
 * Uso:
 *   <Table>
 *     <THead><tr><TH>Nombre</TH></tr></THead>
 *     <TBody>{rows.map(...)}</TBody>
 *   </Table>
 */
export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className={cn('w-full text-left text-sm', className)} {...rest} />
    </div>
  );
}

export function THead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-slate-200 bg-slate-50', className)} {...rest} />;
}

export function TBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-slate-100', className)} {...rest} />;
}

export function TH({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
        className,
      )}
      {...rest}
    />
  );
}

export function TD({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('whitespace-nowrap px-4 py-3 text-slate-700', className)} {...rest} />;
}

export function TR({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('hover:bg-slate-50/70', className)} {...rest} />;
}
