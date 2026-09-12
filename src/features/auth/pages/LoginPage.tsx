import { ShoppingCart } from 'lucide-react'
import { Card, CardBody } from '../../../shared/ui/Card'
import { LoginForm } from '../components/LoginForm'
import { useState } from 'react'
import { authService } from '../services/authService'
import { Alert } from '../../../shared/ui/Alert'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(email: string, password: string) {
        setErrorMessage(null);
        try {
            const { accessToken } = await authService.login({ email, password });
            localStorage.setItem('access-token', accessToken);
            navigate('/home', { replace: true });
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : 'No pudimos iniciar sesión. Intenalo más tarde'
            )
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <ShoppingCart className="size-6" aria-hidden />
                    </div>
                    <h1 className="text-lg font-semibold text-slate-900">Sistema de Ventas</h1>
                    <p className="mt-1 text-sm text-slate-500">Inicia sesión para continuar</p>
                </div>

                <Card>
                    <CardBody className="space-y-4">
                        {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                        <LoginForm onSubmit={handleSubmit} />
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
