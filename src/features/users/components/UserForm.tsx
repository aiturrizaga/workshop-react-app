import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { ApiError } from '@/shared/api/apiError';
import { ROLE_LABELS, USER_ROLES, type UserRole } from '@/shared/constants/roles';
import type { CreateUserRequest, User } from '../types';

export type UserFormValues = CreateUserRequest & { active?: boolean };

interface UserFormProps {
  initialValues?: User;
  onSubmit: (payload: UserFormValues) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

function toFormState(user?: User): FormState {
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    password: '',
    role: user?.role ?? 'SELLER',
    active: user?.active ?? true,
  };
}

function validate(values: FormState, isEditing: boolean): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
  if (!values.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Ingresa un email válido.';

  // Al crear, la contraseña es obligatoria. Al editar, se deja en blanco para no cambiarla.
  if (!isEditing && values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  } else if (isEditing && values.password.length > 0 && values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  }

  return errors;
}

/** Formulario reutilizado para crear y editar usuarios (solo ADMIN). */
export function UserForm({ initialValues, onSubmit, onCancel }: UserFormProps) {
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

    const validationErrors = validate(values, isEditing);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload: UserFormValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
      role: values.role,
      ...(isEditing ? { active: values.active } : {}),
    };

    // Al editar, si no se escribió contraseña nueva, no se envía (el backend la conserva).
    if (isEditing && !values.password) {
      delete (payload as Partial<UserFormValues>).password;
    }

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'No pudimos guardar el usuario.');
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
        <Label htmlFor="password">{isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}</Label>
        <Input
          id="password"
          type="password"
          placeholder={isEditing ? 'Dejar en blanco para no cambiarla' : undefined}
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          error={errors.password}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select
            id="role"
            value={values.role}
            onChange={(event) => updateField('role', event.target.value as UserRole)}
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </Select>
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
      </div>

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
