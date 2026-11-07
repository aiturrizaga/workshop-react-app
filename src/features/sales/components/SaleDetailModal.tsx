import { Modal } from '@/components/ui/Modal';
import { TBody, TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';
import type { Sale } from '../types';
import { SaleStatusBadge } from './SaleStatusBadge';

interface SaleDetailModalProps {
  sale: Sale | null;
  onClose: () => void;
}

/** Reutiliza los datos que ya trae el listado (incluye items): sin fetch extra. */
export function SaleDetailModal({ sale, onClose }: SaleDetailModalProps) {
  return (
    <Modal open={sale !== null} onClose={onClose} title="Detalle de la venta" size="lg">
      {sale && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-slate-500">Cliente</p>
              <p className="font-medium text-slate-900">{sale.customerName}</p>
            </div>
            <div>
              <p className="text-slate-500">Vendedor</p>
              <p className="font-medium text-slate-900">{sale.userName}</p>
            </div>
            <div>
              <p className="text-slate-500">Fecha</p>
              <p className="font-medium text-slate-900">{formatDate(sale.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-500">Estado</p>
              <SaleStatusBadge status={sale.status} />
            </div>
          </div>

          <Table>
            <THead>
              <tr>
                <TH>Producto</TH>
                <TH>Cantidad</TH>
                <TH>Precio unitario</TH>
                <TH>Subtotal</TH>
              </tr>
            </THead>
            <TBody>
              {sale.items.map((item) => (
                <TR key={item.id}>
                  <TD>{item.productName}</TD>
                  <TD>{item.quantity}</TD>
                  <TD>{formatCurrency(item.unitPrice)}</TD>
                  <TD>{formatCurrency(item.subtotal)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <div className="flex justify-end text-base font-semibold text-slate-900">
            Total: {formatCurrency(sale.total)}
          </div>
        </div>
      )}
    </Modal>
  );
}
