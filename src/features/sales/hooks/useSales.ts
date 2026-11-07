import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/shared/api/apiError';
import type { PaginationMeta } from '@/shared/types/api';
import { salesService } from '../services/salesService';
import type { Sale } from '../types';

interface UseSalesParams {
  page: number;
  limit: number;
}

/**
 * Lista las ventas según el rol del usuario autenticado:
 *  - ADMIN   -> GET /sales           (todas)
 *  - SELLER  -> GET /sales/my-sales  (solo las propias)
 *
 * El backend seguiría rechazando con 403 si un SELLER llamara a /sales,
 * así que elegir aquí el endpoint correcto no es solo estética.
 */
export function useSales({ page, limit }: UseSalesParams) {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        user?.role === 'ADMIN'
          ? await salesService.list({ page, limit })
          : await salesService.listMine({ page, limit });
      setSales(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar las ventas.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, user?.role]);

  useEffect(() => {
    void fetchSales();
  }, [fetchSales]);

  return { sales, meta, loading, error, refetch: fetchSales };
}
