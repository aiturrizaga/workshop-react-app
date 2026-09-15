import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select } from '@/shared/ui/Select';
import { ApiError } from '@/shared/api/apiError';
import type { CreateProductRequest, Product } from '../types';


export type ProductFormValues = CreateProductRequest & { active?: boolean };

interface ProductFormProps {
  /** Si se pasa valores iniciales, el formulario se comporta como edición y precarga los valores. */
  initialValues?: Product;
  onSubmit: (payload: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
}

function toFormState(product?: Product): FormState {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock) : '',
    active: product?.active ?? true,
  };
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }

  const price = Number(values.price);
  if (values.price.trim() === '' || Number.isNaN(price) || price <= 0) {
    errors.price = 'El precio debe ser mayor que 0.';
  }

  const stock = Number(values.stock);
  if (values.stock.trim() === '' || Number.isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
    errors.stock = 'El stock debe ser un número entero mayor o igual a 0.';
  }

  return errors;
}

/**
 * Formulario reutilizado para crear y editar productos.
 * `active` solo se envía cuando se está editando: CreateProductDto del
 * backend no acepta ese campo (un producto nuevo siempre nace activo).
 */
export function ProductForm({ initialValues, onSubmit, onCancel }: ProductFormProps) {
  const isEditing = Boolean(initialValues);
  const [values, setValues] = useState<FormState>(() => toFormState(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: ProductFormValues = {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      price: Number(values.price),
      stock: Number(values.stock),
      ...(isEditing ? { active: values.active } : {}),
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'No pudimos guardar el producto.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={errors.name}
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(event) => updateField('price', event.target.value)}
            error={errors.price}
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={(event) => updateField('stock', event.target.value)}
            error={errors.stock}
          />
        </div>
      </div>

      {isEditing && (
        <div>
          <Label htmlFor="active">Estado</Label>
          <Select
            id="active"
            value={values.active ? 'true' : 'false'}
            onChange={(event) => updateField('active', event.target.value === 'true')}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
