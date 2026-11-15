import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/apiError';
import { dashboardService } from '../services/dashboardService';
import type {
  DashboardKpis,
  DateRange,
  ProductPerformance,
  SalesByDay,
  SalesBySeller,
  TopProduct,
} from '../types';

/** Estado independiente por tarjeta: cargando, error o datos. */
export interface AsyncSection<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const INITIAL: AsyncSection<never> = { data: null, loading: true, error: null };

function toMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'No pudimos cargar estos datos.';
}

/**
 * Carga en paralelo todos los datos de los gráficos para un rango.
 * Cada sección tiene su propio estado: si un endpoint falla, solo esa
 * tarjeta muestra el error y las demás siguen funcionando.
 */
export function useDashboardCharts(range: DateRange) {
  const [kpis, setKpis] = useState<AsyncSection<DashboardKpis>>(INITIAL);
  const [salesByDay, setSalesByDay] = useState<AsyncSection<SalesByDay[]>>(INITIAL);
  const [topProducts, setTopProducts] = useState<AsyncSection<TopProduct[]>>(INITIAL);
  const [salesBySeller, setSalesBySeller] = useState<AsyncSection<SalesBySeller[]>>(INITIAL);
  const [performance, setPerformance] = useState<AsyncSection<ProductPerformance[]>>(INITIAL);

  const load = useCallback(() => {
    // Evita aplicar respuestas de un rango anterior si el usuario cambió el filtro.
    let cancelled = false;

    function track<T>(promise: Promise<{ data: T }>, setState: (state: AsyncSection<T>) => void) {
      setState({ data: null, loading: true, error: null });
      promise
        .then((response) => {
          if (!cancelled) setState({ data: response.data, loading: false, error: null });
        })
        .catch((error: unknown) => {
          if (!cancelled) setState({ data: null, loading: false, error: toMessage(error) });
        });
    }

    track(dashboardService.kpis(range), setKpis);
    track(dashboardService.salesByDay(range), setSalesByDay);
    track(dashboardService.topProducts(range), setTopProducts);
    track(dashboardService.salesBySeller(range), setSalesBySeller);
    track(dashboardService.productPerformance(range), setPerformance);

    return () => {
      cancelled = true;
    };
  }, [range]);

  useEffect(() => load(), [load]);

  return { kpis, salesByDay, topProducts, salesBySeller, performance, reload: load };
}
