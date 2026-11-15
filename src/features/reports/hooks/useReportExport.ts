import { useCallback, useState } from 'react';
import { toast } from '@/components/feedback/toast';
import type { DownloadedFile } from '@/shared/api/apiClient';
import { ApiError } from '@/shared/api/apiError';
import { printPdf, saveFile } from '@/shared/utils/saveFile';

export type ReportAction = 'download' | 'preview' | 'print';

/**
 * Maneja la generación de un reporte: bloquea los botones mientras el
 * backend genera el archivo (`busyKey`) y muestra errores con un toast.
 */
export function useReportExport() {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; filename: string } | null>(null);

  const run = useCallback(
    async (key: string, action: ReportAction, request: () => Promise<DownloadedFile>) => {
      setBusyKey(key);
      try {
        const { blob, filename } = await request();
        if (action === 'download') {
          saveFile(blob, filename);
          toast.success(`Reporte generado: ${filename}`);
        } else if (action === 'print') {
          printPdf(blob);
        } else {
          setPreview({ url: URL.createObjectURL(blob), filename });
        }
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'No pudimos generar el reporte.');
      } finally {
        setBusyKey(null);
      }
    },
    [],
  );

  const closePreview = useCallback(() => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
  }, []);

  return { busyKey, preview, run, closePreview };
}
