import { ShoppingCart } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import type { Customer } from '@/features/customers/types';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import type { CartItem } from '../types';
import { SaleItemRow } from './SaleItemRow';

interface SaleSummaryProps {
  customers: Customer[];
  customerId: string;
  onCustomerChange: (customerId: string) => void;
  items: CartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  total: number;
  submitting: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
}

/** Columna derecha de "Nueva venta": cliente, líneas agregadas y total. */
export function SaleSummary({
  customers,
  customerId,
  onCustomerChange,
  items,
  onQuantityChange,
  onRemove,
  total,
  submitting,
  errorMessage,
  onConfirm,
}: SaleSummaryProps) {
  const canConfirm = customerId !== '' && items.length > 0 && !submitting;

  return (
    <div className="flex h-full flex-col">
      <div>
        <Label htmlFor="customerId">Cliente</Label>
        <Select
          id="customerId"
          value={customerId}
          onChange={(event) => onCustomerChange(event.target.value)}
        >
          <option value="">Selecciona un cliente...</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName} &middot; {customer.documentNumber}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 flex-1 divide-y divide-slate-100 border-y border-slate-200">
        {items.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="Aún no agregaste productos." />
        ) : (
          items.map((item) => (
            <SaleItemRow
              key={item.productId}
              item={item}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-base font-semibold text-slate-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {errorMessage && (
        <Alert variant="danger" className="mt-4">
          {errorMessage}
        </Alert>
      )}

      <Button
        className="mt-4 w-full"
        disabled={!canConfirm}
        loading={submitting}
        onClick={onConfirm}
      >
        {submitting ? 'Registrando venta...' : 'Confirmar venta'}
      </Button>
    </div>
  );
}
