import type { PaginationQuery } from '@/shared/types/api';

/** Coincide con CustomerResponseDto del backend. */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Cuerpo de POST /api/customers (CreateCustomerDto). */
export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  documentNumber: string;
  email?: string;
  phone?: string;
}

/** Cuerpo de PATCH /api/customers/:id (UpdateCustomerDto): todo opcional. */
export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  active?: boolean;
}

/** Query params soportados por GET /api/customers. */
export interface CustomerQuery extends PaginationQuery {
  search?: string;
}
