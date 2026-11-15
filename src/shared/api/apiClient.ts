import { AUTH_TOKEN_STORAGE_KEY } from '@/shared/constants/storage';
import { UNAUTHORIZED_EVENT } from '@/shared/constants/events';
import type { ApiErrorBody } from '@/shared/types/api';
import { ApiError } from './apiError';

/**
 * Única fuente de la URL base del API. Nunca escribir la URL a mano
 * dentro de un service: siempre pasar por apiClient.
 *
 * VITE_API_URL es una variable de entorno pública (todo lo que empieza
 * con VITE_ queda embebido en el bundle del cliente), así que solo debe
 * contener información pública como esta URL base.
 */
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  // Falla rápido y con un mensaje claro en vez de peticiones a "undefined/...".
  throw new Error('Falta configurar VITE_API_URL en el archivo .env');
}

type QueryValue = string | number | boolean | undefined | null;

interface RequestOptions {
  body?: unknown;
  query?: Record<string, QueryValue>;
}

/** Arma "?page=1&limit=10" ignorando valores undefined/null/"" . */
function buildQueryString(query?: Record<string, QueryValue>): string {
  if (!query) return '';

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Ejecuta una petición HTTP contra el backend y devuelve el JSON ya
 * parseado con el tipo esperado. Centraliza: base URL, headers,
 * Authorization, serialización JSON y manejo de errores.
 */
async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}${buildQueryString(options.query)}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  // 204 No Content u otras respuestas sin cuerpo.
  const rawBody = await response.text();
  const parsedBody: unknown = rawBody ? JSON.parse(rawBody) : undefined;

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(
      (parsedBody as ApiErrorBody) ?? {
        statusCode: response.status,
        message: response.statusText,
        error: 'Error',
      },
    );
  }

  return parsedBody as T;
}

/** Archivo binario descargado del backend (reportes PDF, Excel, CSV). */
export interface DownloadedFile {
  blob: Blob;
  filename: string;
}

/** Lee el nombre de archivo propuesto por el backend en Content-Disposition. */
function filenameFromDisposition(disposition: string | null, fallback: string): string {
  if (!disposition) return fallback;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utf8) return decodeURIComponent(utf8[1]);
  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  return plain?.[1] ?? fallback;
}

/**
 * Pide un ARCHIVO al backend. `request` hace JSON.parse, que no sirve para
 * binarios: aquí se lee la respuesta con `response.blob()`.
 * Si el backend responde con error, el cuerpo sí es JSON ({ statusCode, message }).
 */
async function download(path: string, query?: object): Promise<DownloadedFile> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  const response = await fetch(
    `${API_URL}${path}${buildQueryString(query as Record<string, QueryValue> | undefined)}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    const rawBody = await response.text();
    let body: ApiErrorBody;
    try {
      body = JSON.parse(rawBody) as ApiErrorBody;
    } catch {
      body = { statusCode: response.status, message: response.statusText, error: 'Error' };
    }
    throw new ApiError(body);
  }

  return {
    blob: await response.blob(),
    filename: filenameFromDisposition(response.headers.get('Content-Disposition'), 'reporte'),
  };
}

export const apiClient = {
  // `query` acepta cualquier objeto de query params tipado por el caller
  // (ProductQuery, CustomerQuery, ...). TypeScript no permite asignar un
  // `interface` cerrado a `Record<string, QueryValue>` directamente, así
  // que se acepta `object` aquí y se confía en que sus valores son
  // primitivos (así se declaran todos los *Query de cada feature).
  get: <T>(path: string, query?: object) =>
    request<T>('GET', path, { query: query as Record<string, QueryValue> | undefined }),

  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),

  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),

  delete: <T>(path: string) => request<T>('DELETE', path),

  /** Descarga un archivo (Blob + nombre sugerido por el backend). */
  download,
};
