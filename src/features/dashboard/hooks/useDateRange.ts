import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addDaysIso, todayIso } from '@/shared/utils/dateRange';
import type { DateRange } from '../types';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Últimos 30 días hasta hoy (mismo valor por defecto que el backend). */
export function defaultDateRange(): DateRange {
  const to = todayIso();
  return { from: addDaysIso(to, -29), to };
}

/**
 * Rango de fechas guardado en la URL (?from=...&to=...). Así el filtro se
 * conserva al cambiar entre las páginas de cada librería y se puede
 * compartir el enlace con el mismo periodo.
 */
export function useDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();

  const range = useMemo<DateRange>(() => {
    const fallback = defaultDateRange();
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    return {
      from: from && DAY_PATTERN.test(from) ? from : fallback.from,
      to: to && DAY_PATTERN.test(to) ? to : fallback.to,
    };
  }, [searchParams]);

  const setRange = useCallback(
    (next: DateRange) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          params.set('from', next.from);
          params.set('to', next.to);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { range, setRange };
}
