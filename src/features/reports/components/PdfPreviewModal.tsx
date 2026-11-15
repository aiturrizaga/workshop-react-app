import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PdfPreviewModalProps {
  preview: { url: string; filename: string } | null;
  onClose: () => void;
}

/**
 * Vista previa del PDF con el visor del navegador (un iframe con la URL
 * del Blob): sin dependencias y ya trae zoom e impresión. Se ve un poco
 * distinto en cada navegador; para un visor uniforme se puede usar react-pdf.
 */
export function PdfPreviewModal({ preview, onClose }: PdfPreviewModalProps) {
  useEffect(() => {
    if (!preview) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [preview, onClose]);

  if (!preview) return null;

  function handlePrint() {
    const frame = document.getElementById('pdf-preview-frame') as HTMLIFrameElement | null;
    frame?.contentWindow?.focus();
    frame?.contentWindow?.print();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Vista previa de ${preview.filename}`}
        className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <h2 className="truncate text-sm font-semibold text-slate-900">{preview.filename}</h2>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={<Printer className="size-4" />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <a
              href={preview.url}
              download={preview.filename}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Download className="size-4" aria-hidden />
              Descargar
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar vista previa"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>
        <iframe
          id="pdf-preview-frame"
          src={preview.url}
          title={`Reporte ${preview.filename}`}
          className="w-full flex-1 bg-slate-100"
        />
      </div>
    </div>,
    document.body,
  );
}
