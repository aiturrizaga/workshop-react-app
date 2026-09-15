import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { HomePage } from './features/home/pages/HomePage';
import { ProductsPage } from './features/products/pages/ProductsPage';

export function AppRouter() {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    )
}