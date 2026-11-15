import type { ReactNode } from 'react';

/** Coincide EXACTAMENTE con la respuesta de GET /api/dashboard del backend. */
export interface DashboardData {
  products: {
    total: number;
    active: number;
  };
  customers: {
    total: number;
    active: number;
  };
  sales: {
    today: number;
    month: number;
    monthTotal: number;
  };
}

/** Rango de fechas (YYYY-MM-DD, inclusive) que se envía como ?from&to. */
export interface DateRange {
  from: string;
  to: string;
}

/** GET /api/dashboard/kpis */
export interface DashboardKpis {
  from: string;
  to: string;
  salesCount: number;
  revenue: number;
  averageTicket: number;
  unitsSold: number;
  cancelledCount: number;
}

/** GET /api/dashboard/sales-by-day (ya agregado por la base de datos). */
export interface SalesByDay {
  date: string; // '2026-11-14'
  count: number; // ventas del día
  total: number; // ingresos del día
}

/** GET /api/dashboard/top-products */
export interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
  total: number;
}

/** GET /api/dashboard/sales-by-seller */
export interface SalesBySeller {
  userId: string;
  name: string;
  count: number;
  total: number;
}

/** GET /api/dashboard/product-performance */
export interface ProductPerformance {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  stock: number;
}

/**
 * Componentes de gráfico que cada librería implementa. Las páginas de
 * cada librería reciben los MISMOS datos y responden las MISMAS preguntas;
 * solo cambia cómo se dibuja.
 */
export interface DashboardChartSet {
  /** Tendencia: ¿cómo evolucionan los ingresos por día? */
  SalesByDayChart: (props: { data: SalesByDay[] }) => ReactNode;
  /** Comparar: ¿qué producto vendió más? */
  TopProductsChart: (props: { data: TopProduct[] }) => ReactNode;
  /** Composición: ¿qué parte del total aporta cada vendedor? */
  SalesBySellerChart: (props: { data: SalesBySeller[] }) => ReactNode;
  /** Relación: ¿precio vs. unidades vendidas? */
  ProductPerformanceChart: (props: { data: ProductPerformance[] }) => ReactNode;
}
