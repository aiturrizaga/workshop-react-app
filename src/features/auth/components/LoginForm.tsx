import { useState, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { Label } from '../../../shared/ui/Label'

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
}

interface FormErrors {
    email?: string;
    password?: string;
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Ingresa un email válido.';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return errors;
}

export const LoginForm = ({onSubmit}: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const validationErrors = validate(email, password);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitting(true);
        try {
            await onSubmit(email, password);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={errors.email}
                />
            </div>

            <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={errors.password}
                />
            </div>

            <Button type="submit" className="w-full" loading={submitting}>
                {submitting ? 'Ingresando...' : 'Iniciar sesión'}
            </Button>
        </form>
    )
}
