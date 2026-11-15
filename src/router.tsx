import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Spinner } from './components/ui/Spinner';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { AuthLayout } from './shared/layout/AuthLayout';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { DashboardLayout } from './shared/layout/DashboardLayout';
import { NotFoundPage } from './shared/pages/NotFoundPage';
import { CustomersPage } from './features/customers/pages/CustomersPage';
import { SalesPage } from './features/sales/pages/SalesPage';
import { NewSalePage } from './features/sales/pages/NewSalePage';
import { UsersPage } from './features/users/pages/UsersPage';
import { ReportsPage } from './features/reports/pages/ReportsPage';

/**
 * Cada página de librería de gráficos se carga bajo demanda (code splitting):
 * así Recharts, ECharts, Nivo, etc. no engordan el bundle inicial.
 */
const lazyPage = <K extends string>(
  loader: () => Promise<Record<K, React.ComponentType>>,
  name: K,
) => lazy(() => loader().then((module) => ({ default: module[name] })));

const RechartsDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/RechartsDashboardPage'),
  'RechartsDashboardPage',
);
const ChartJsDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/ChartJsDashboardPage'),
  'ChartJsDashboardPage',
);
const EChartsDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/EChartsDashboardPage'),
  'EChartsDashboardPage',
);
const NivoDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/NivoDashboardPage'),
  'NivoDashboardPage',
);
const ApexChartsDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/ApexChartsDashboardPage'),
  'ApexChartsDashboardPage',
);
const MuiChartsDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/MuiChartsDashboardPage'),
  'MuiChartsDashboardPage',
);
const VisxDashboardPage = lazyPage(
  () => import('./features/dashboard/pages/libraries/VisxDashboardPage'),
  'VisxDashboardPage',
);

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<Spinner label="Cargando gráficos..." />}>{element}</Suspense>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/recharts" element={withSuspense(<RechartsDashboardPage />)} />
          <Route path="/dashboard/chartjs" element={withSuspense(<ChartJsDashboardPage />)} />
          <Route path="/dashboard/echarts" element={withSuspense(<EChartsDashboardPage />)} />
          <Route path="/dashboard/nivo" element={withSuspense(<NivoDashboardPage />)} />
          <Route path="/dashboard/apexcharts" element={withSuspense(<ApexChartsDashboardPage />)} />
          <Route path="/dashboard/mui" element={withSuspense(<MuiChartsDashboardPage />)} />
          <Route path="/dashboard/visx" element={withSuspense(<VisxDashboardPage />)} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/reports" element={<ReportsPage />} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
