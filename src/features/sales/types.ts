import type { PaginationQuery } from '@/shared/types/api';

export type SaleStatus = 'COMPLETED' | 'CANCELLED';

/** Un ítem dentro de una venta (coincide con la respuesta del backend). */
export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** Coincide con SaleResponseDto del backend. */
export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  userId: string;
  userName: string;
  total: number;
  status: SaleStatus;
  createdAt: string;
  items: SaleItem[];
}

/**
 * Cuerpo de POST /api/sales (CreateSaleDto).
 * El frontend SOLO envía productId + quantity: el backend calcula precio,
 * valida stock y determina el total real (ver SalesService.create).
 */
export interface CreateSaleItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateSaleRequest {
  customerId: string;
  items: CreateSaleItemRequest[];
}

export type SaleQuery = PaginationQuery;

/**
 * Línea del carrito en la pantalla "Nueva venta". Es un concepto SOLO de UI
 * (el backend no conoce esta forma): guarda el precio/stock ya consultados
 * al backend únicamente para mostrar un total de referencia mientras se arma
 * la venta. El total real lo calcula y confirma el backend al confirmar.
 */
export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  availableStock: number;
  quantity: number;
}
