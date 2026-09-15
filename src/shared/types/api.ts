/**
 * Formas de respuesta que usa el backend (NestJS) de forma consistente
 * en toda la API. Ver README del backend, sección "API Response".
 */

/** Envoltura de un recurso único: { "data": {...} } */
export interface ApiResponse<T> {
  data: T;
}

/** Metadatos de paginación devueltos por los listados. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Envoltura de un listado paginado: { "data": [...], "meta": {...} } */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Cuerpo de error estándar del backend: { statusCode, message, error } */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
}

/** Query params de paginación aceptados por los listados. */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
