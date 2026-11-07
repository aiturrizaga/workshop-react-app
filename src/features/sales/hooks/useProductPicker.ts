import { useEffect, useState } from 'react';
import { productsService } from '@/features/products/services/productsService';
import type { Product } from '@/features/products/types';
import { ApiError } from '@/shared/api/apiError';

/**
 * Busca productos activos para agregarlos a una venta nueva.
 * Solo se reutiliza el service de products, no se duplica lógica de fetch.
 */
export function useProductPicker(search: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await productsService.list({ search, active: true, page: 1, limit: 20 });
        if (!cancelled) setProducts(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'No pudimos cargar los productos.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [search]);

  return { products, loading, error };
}
