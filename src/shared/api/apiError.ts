import type { ApiErrorBody } from '@/shared/types/api';

/**
 * Error tipado que representa una respuesta HTTP no exitosa del backend.
 * Permite a las páginas mostrar `error.message` sin volver a parsear JSON.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;

  constructor(body: ApiErrorBody) {
    // El backend a veces envía un array de mensajes (errores de validación).
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    super(message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.error = body.error;
  }
}
