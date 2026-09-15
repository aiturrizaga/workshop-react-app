import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface SpinnerProps {
  label?: string;
  className?: string;
}

/** Indicador de carga. */
export function Spinner({ label, className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-10 text-slate-500',
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin text-brand-600" aria-hidden />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
