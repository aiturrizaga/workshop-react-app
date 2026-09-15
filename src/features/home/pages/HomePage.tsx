import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardBody } from '@/shared/ui/Card';
import { AUTH_TOKEN_STORAGE_KEY } from '@/shared/constants/storage';


export function HomePage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <ShoppingCart className="size-6" aria-hidden />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">¡Bienvenido!</h1>
          <p className="text-sm text-slate-500">
            Iniciaste sesión correctamente en el Sistema de Ventas e Inventario.
          </p>
          <Button
            className="w-full"
            icon={<Package className="size-4" aria-hidden />}
            onClick={() => navigate('/products')}
          >
            Ver productos
          </Button>
          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
