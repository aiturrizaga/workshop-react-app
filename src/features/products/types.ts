import type { PaginationQuery } from '@/shared/types/api';

/** Coincide con ProductResponseDto del backend. */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Cuerpo de POST /api/products (CreateProductDto). */
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

/** Cuerpo de PATCH /api/products/:id (UpdateProductDto): todo opcional. */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  active?: boolean;
}

/** Query params soportados por GET /api/products. */
export interface ProductQuery extends PaginationQuery {
  search?: string;
  active?: boolean;
}
