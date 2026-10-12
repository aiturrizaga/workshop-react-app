import { CircleAlert, Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

type AlertVariant = 'info' | 'warning' | 'danger';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<AlertVariant, { wrapper: string; icon: ReactNode }> = {
  info: {
    wrapper: 'bg-brand-50 text-brand-800 border-brand-200',
    icon: <Info className="size-5 text-brand-600" aria-hidden />,
  },
  warning: {
    wrapper: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <TriangleAlert className="size-5 text-amber-600" aria-hidden />,
  },
  danger: {
    wrapper: 'bg-red-50 text-red-800 border-red-200',
    icon: <CircleAlert className="size-5 text-red-600" aria-hidden />,
  },
};

/**
 * Mensaje de estado dentro del contenido de la página (no confundir con los
 * toasts de sonner, que son para feedback puntual de acciones).
 *
 * Uso: <Alert variant="danger">No pudimos cargar los productos.</Alert>
 */
export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-lg border px-4 py-3 text-sm', styles.wrapper, className)}
    >
      {styles.icon}
      <div>
        {title && <p className="font-medium">{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  );
}
