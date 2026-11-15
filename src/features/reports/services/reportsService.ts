import { apiClient } from '@/shared/api/apiClient';
import type { InventoryReportQuery, SalesReportQuery } from '../types';

/**
 * El backend GENERA el archivo (valida permisos, consulta y arma el
 * PDF/XLSX/CSV); el frontend solo lo descarga o lo muestra.
 * Cada método devuelve { blob, filename }.
 */
export const reportsService = {
  /** GET /reports/sales?from&to&format — ADMIN: todas; SELLER: solo las suyas. */
  sales(query: SalesReportQuery) {
    return apiClient.download('/reports/sales', query);
  },

  /** GET /reports/inventory?format&filter — solo ADMIN. */
  inventory(query: InventoryReportQuery) {
    return apiClient.download('/reports/inventory', query);
  },
};
