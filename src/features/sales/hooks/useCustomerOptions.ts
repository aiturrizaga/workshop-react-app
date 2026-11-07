import { useEffect, useState } from 'react';
import { customersService } from '@/features/customers/services/customersService';
import type { Customer } from '@/features/customers/types';

/** Carga los clientes activos disponibles para asignar a una nueva venta. */
export function useCustomerOptions() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customersService
      .list({ page: 1, limit: 100 })
      .then((response) => setCustomers(response.data.filter((customer) => customer.active)))
      .finally(() => setLoading(false));
  }, []);

  return { customers, loading };
}
