/** Formatos que genera el backend (GET /reports/...?format=). */
export type ReportFormat = 'pdf' | 'xlsx' | 'csv';

export type InventoryFilter = 'all' | 'active' | 'low-stock';

export interface SalesReportQuery {
  from: string;
  to: string;
  format: ReportFormat;
}

export interface InventoryReportQuery {
  format: ReportFormat;
  filter: InventoryFilter;
}

export const FORMAT_LABELS: Record<ReportFormat, string> = {
  pdf: 'PDF',
  xlsx: 'Excel',
  csv: 'CSV',
};
