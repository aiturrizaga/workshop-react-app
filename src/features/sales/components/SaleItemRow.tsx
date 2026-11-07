import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import type { CartItem } from '../types';

interface SaleItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

/**
 * Fila de un producto ya agregado al carrito. La cantidad no puede superar
 * el stock disponible que devolvió el backend (validación de UX; el backend
 * vuelve a validar el stock real al confirmar la venta).
 */
export function SaleItemRow({ item, onQuantityChange, onRemove }: SaleItemRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{item.productName}</p>
        <p className="text-xs text-slate-500">{formatCurrency(item.unitPrice)} c/u</p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label={`Reducir cantidad de ${item.productName}`}
          className="flex size-7 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
        >
          <Minus className="size-3.5" aria-hidden />
        </button>
        <span className="w-6 text-center text-sm font-medium text-slate-700">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.availableStock}
          aria-label={`Aumentar cantidad de ${item.productName}`}
          className="flex size-7 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
        >
          <Plus className="size-3.5" aria-hidden />
        </button>
      </div>

      <p className="w-20 shrink-0 text-right text-sm font-medium text-slate-900">
        {formatCurrency(item.unitPrice * item.quantity)}
      </p>

      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        aria-label={`Quitar ${item.productName}`}
        className="text-slate-400 hover:text-red-500"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}
