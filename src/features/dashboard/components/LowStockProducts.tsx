import { useEffect, useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { productsService } from '@/features/products/services/productsService';
import type { Product } from '@/features/products/types';

const LOW_STOCK_THRESHOLD = 5;

/**
 * El backend no expone un endpoint de "stock bajo": se reutiliza el listado
 * real de productos activos y se ordena/filtra en el cliente. Son datos
 * reales, no inventados; solo el criterio de "bajo" (<= 5) es una decisión
 * de presentación.
 */
export function LowStockProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService
      .list({ page: 1, limit: 50, active: true })
      .then((response) => {
        const lowStock = response.data
          .filter((product) => product.stock <= LOW_STOCK_THRESHOLD)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);
        setProducts(lowStock);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-slate-900">Productos con stock bajo</h2>
      </CardHeader>
      <CardBody>
        {loading && <Spinner label="Cargando productos..." />}
        {!loading && products.length === 0 && (
          <EmptyState icon={PackageSearch} title="Ningún producto tiene stock bajo." />
        )}
        {!loading && products.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <span className="truncate font-medium text-slate-900">{product.name}</span>
                <span className="shrink-0 font-medium text-amber-600">
                  {product.stock} en stock
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
