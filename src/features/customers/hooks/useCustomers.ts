import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/apiError';
import type { PaginationMeta } from '@/shared/types/api';
import { customersService } from '../services/customersService';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types';

interface UseCustomersParams {
  page: number;
  limit: number;
  search: string;
}

/** Mismo patrón que useProducts: Page -> hook -> service -> apiClient. */
export function useCustomers({ page, limit, search }: UseCustomersParams) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customersService.list({ page, limit, search });
      setCustomers(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar los clientes.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  async function createCustomer(payload: CreateCustomerRequest) {
    await customersService.create(payload);
    await fetchCustomers();
  }

  async function updateCustomer(id: string, payload: UpdateCustomerRequest) {
    await customersService.update(id, payload);
    await fetchCustomers();
  }

  async function deleteCustomer(id: string) {
    await customersService.remove(id);
    await fetchCustomers();
  }

  return { customers, meta, loading, error, createCustomer, updateCustomer, deleteCustomer };
}
