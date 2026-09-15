import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Alert } from '@/shared/ui/Alert';
import { Card, CardBody } from '@/shared/ui/Card';
import { ApiError } from '@/shared/api/apiError';
import { AUTH_TOKEN_STORAGE_KEY } from '@/shared/constants/storage';
import { authService } from '../services/authService';
import { LoginForm } from '../components/LoginForm';


export function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(email: string, password: string) {
    setErrorMessage(null);
    try {
      const { accessToken } = await authService.login({ email, password });
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
      navigate('/home', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'No pudimos iniciar sesión. Intenta de nuevo.',
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <ShoppingCart className="size-6" aria-hidden />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Sistema de Ventas e Inventario</h1>
          <p className="mt-1 text-sm text-slate-500">Inicia sesión para continuar</p>
        </div>

        <Card>
          <CardBody className="space-y-4">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <LoginForm onSubmit={handleSubmit} />
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-400">
          <b>Administrador:</b> admin@example.com / Admin123*
          <br />
          <b>Cajero:</b> seller@example.com / Seller123*
        </p>
      </div>
    </div>
  );
}
