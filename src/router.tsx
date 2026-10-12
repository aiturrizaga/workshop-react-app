import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { HomePage } from './features/home/pages/HomePage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { AuthLayout } from './shared/layout/AuthLayout';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { DashboardLayout } from './shared/layout/DashboardLayout';
import { NotFoundPage } from './shared/pages/NotFoundPage';
import { CustomersPage } from './features/customers/pages/CustomersPage';

export function AppRouter() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path='/login' element={<LoginPage />} />
            </Route>


            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/products' element={<ProductsPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>

            <Route path='/' element={<Navigate to='/home' replace />} />

        </Routes >
    )
}