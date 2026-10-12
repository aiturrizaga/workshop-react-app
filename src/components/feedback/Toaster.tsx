import { Toaster as SonnerToaster } from 'sonner';

/** Se monta una única vez en App.tsx. */
export function Toaster() {
  return <SonnerToaster position="top-right" richColors closeButton />;
}
