import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { formatShortDay } from '@/shared/utils/dateRange';
import {
  CHART_COLORS,
  CHART_HEIGHT,
  formatCurrency,
  formatCurrencyShort,
  toDonutSlices,
} from '../../chartTheme';
import { LibraryDashboard } from '../../components/LibraryDashboard';
import type { ProductPerformance, SalesByDay, SalesBySeller, TopProduct } from '../../types';

/** Recharts: JSX declarativo. XAxis, Tooltip y Bar se componen como cualquier componente. */
function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDay} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 12 }} width={80} />
        <Tooltip
          labelFormatter={(label) => formatShortDay(String(label))}
          formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
        />
        <Bar dataKey="total" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      {/* Barras horizontales: los nombres de producto suelen ser largos */}
      <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis type="number" tickFormatter={formatCurrencyShort} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, _name, item) => [
            `${formatCurrency(Number(value))} (${(item.payload as TopProduct).quantity} u.)`,
            'Ingresos',
          ]}
        />
        <Bar dataKey="total" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <PieChart>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="label"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
        >
          {slices.map((slice) => (
            <Cell key={slice.id} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend verticalAlign="bottom" iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <ScatterChart margin={{ bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          type="number"
          dataKey="price"
          name="Precio"
          tickFormatter={formatCurrencyShort}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="quantity"
          name="Unidades"
          allowDecimals={false}
          tick={{ fontSize: 12 }}
        />
        <ZAxis dataKey="name" name="Producto" range={[60, 60]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name) =>
            name === 'Precio' ? formatCurrency(Number(value)) : String(value)
          }
        />
        <Scatter data={data} fill={CHART_COLORS.secondary} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function RechartsDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="recharts"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
