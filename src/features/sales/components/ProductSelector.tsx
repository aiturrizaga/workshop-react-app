import { useState } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Product } from '@/features/products/types';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useProductPicker } from '../hooks/useProductPicker';

interface ProductSelectorProps {
  onAdd: (product: Product) => void;
}

/**
 * Columna izquierda de "Nueva venta": busca productos activos y permite
 * agregarlos al carrito. La cantidad se ajusta después en SaleItemsTable.
 */
export function ProductSelector({ onAdd }: ProductSelectorProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { products, loading, error } = useProductPicker(debouncedSearch);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <Input
          className="pl-9"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar producto"
        />
      </div>

      {loading && <Spinner label="Buscando productos..." />}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && products.length === 0 && (
        <EmptyState icon={Package} title="No se encontraron productos." />
      )}

      {!loading && !error && products.length > 0 && (
        <ul className="max-h-[28rem] space-y-2 overflow-y-auto">
          {products.map((product) => {
            const outOfStock = product.stock === 0;
            return (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(product.price)} &middot; Stock: {product.stock}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={outOfStock}
                  onClick={() => onAdd(product)}
                  icon={<Plus className="size-4" aria-hidden />}
                >
                  Agregar
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
