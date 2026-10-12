import { X } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Sidebar } from './Sidebar';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex justify-end p-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <Sidebar onNavigate={onClose} />
    </Drawer>
  );
}
