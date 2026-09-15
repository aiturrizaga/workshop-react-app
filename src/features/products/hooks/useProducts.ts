import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/apiError';
import type { PaginationMeta } from '@/shared/types/api';
import { productsService } from '../services/productsService';
import type { CreateProductRequest, Product, UpdateProductRequest } from '../types';

interface UseProductsParams {
  page: number;
  limit: number;
  search: string;
  active?: boolean;
}

/**
 * Encapsula el listado de productos: loading/error/data + acciones CRUD.
 */
export function useProducts({ page, limit, search, active }: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsService.list({ page, limit, search, active });
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, active]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  async function createProduct(payload: CreateProductRequest) {
    await productsService.create(payload);
    await fetchProducts();
  }

  async function updateProduct(id: string, payload: UpdateProductRequest) {
    await productsService.update(id, payload);
    await fetchProducts();
  }

  async function deleteProduct(id: string) {
    await productsService.remove(id);
    await fetchProducts();
  }

  return { products, meta, loading, error, createProduct, updateProduct, deleteProduct };
}
