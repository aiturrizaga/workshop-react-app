import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Panel lateral deslizante para el menú de navegación en mobile.
 */
export function Drawer({ open, onClose, children }: DrawerProps) {
  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity md:hidden',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="Cerrar menú"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
