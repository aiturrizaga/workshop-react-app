import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { ApiError } from '@/shared/api/apiError';
import type { CreateCustomerRequest, Customer } from '../types';

export type CustomerFormValues = CreateCustomerRequest & { active?: boolean };

interface CustomerFormProps {
  initialValues?: Customer;
  onSubmit: (payload: CustomerFormValues) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  active: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  documentNumber?: string;
  email?: string;
}

function toFormState(customer?: Customer): FormState {
  return {
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    documentNumber: customer?.documentNumber ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    active: customer?.active ?? true,
  };
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
  if (!values.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
  if (!values.documentNumber.trim()) errors.documentNumber = 'El documento es obligatorio.';
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Ingresa un email válido.';
  }

  return errors;
}

/** Formulario reutilizado para crear y editar clientes. */
export function CustomerForm({ initialValues, onSubmit, onCancel }: CustomerFormProps) {
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

    const payload: CustomerFormValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      documentNumber: values.documentNumber.trim(),
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      ...(isEditing ? { active: values.active } : {}),
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'No pudimos guardar el cliente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nombres</Label>
          <Input
            id="firstName"
            value={values.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            error={errors.firstName}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apellidos</Label>
          <Input
            id="lastName"
            value={values.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            error={errors.lastName}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="documentNumber">Documento</Label>
        <Input
          id="documentNumber"
          value={values.documentNumber}
          onChange={(event) => updateField('documentNumber', event.target.value)}
          error={errors.documentNumber}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={errors.email}
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
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
