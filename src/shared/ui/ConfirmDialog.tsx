import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reemplaza window.confirm() para acciones destructivas (eliminar/desactivar).
 *
 * Uso:
 *   <ConfirmDialog
 *     open={productToDelete !== null}
 *     title="¿Eliminar producto?"
 *     description="Esta acción no se puede deshacer."
 *     onConfirm={handleConfirmDelete}
 *     onCancel={() => setProductToDelete(null)}
 *   />
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <TriangleAlert className="size-5 text-red-600" aria-hidden />
        </div>
        <p className="pt-2 text-sm text-slate-600">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
