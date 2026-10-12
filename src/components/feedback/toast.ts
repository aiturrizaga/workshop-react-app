import { toast as sonnerToast } from 'sonner';

/**
 * Wrapper delgado sobre sonner para no acoplar toda la app a la librería
 * de toasts. Si algún día se cambia de librería, solo se toca este archivo.
 */
export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
};
