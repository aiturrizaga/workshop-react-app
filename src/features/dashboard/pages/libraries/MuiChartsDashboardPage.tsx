import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
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

/**
 * MUI X Charts: los ejes y las series se describen como arreglos de
 * configuración. Es la opción natural si el proyecto ya usa Material UI
 * (comparte tema, tipografía y estilos con el resto de componentes MUI).
 */
const currency = (value: number | null) => (value === null ? '' : formatCurrency(value));

function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  return (
    <LineChart
      height={CHART_HEIGHT}
      xAxis={[
        {
          scaleType: 'point',
          data: data.map((day) => day.date),
          valueFormatter: (value: string) => formatShortDay(value),
        },
      ]}
      yAxis={[{ min: 0, valueFormatter: (value: number) => formatCurrencyShort(value), width: 72 }]}
      series={[
        {
          data: data.map((day) => day.total),
          label: 'Ingresos',
          color: CHART_COLORS.primary,
          area: true,
          showMark: false,
          valueFormatter: currency,
        },
      ]}
      hideLegend
      grid={{ horizontal: true }}
    />
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  return (
    <BarChart
      height={CHART_HEIGHT}
      layout="horizontal"
      yAxis={[{ scaleType: 'band', data: data.map((product) => product.name), width: 130 }]}
      xAxis={[{ valueFormatter: (value: number) => formatCurrencyShort(value) }]}
      series={[
        {
          data: data.map((product) => product.total),
          label: 'Ingresos',
          color: CHART_COLORS.primary,
          valueFormatter: (value, { dataIndex }) =>
            `${currency(value)} (${data[dataIndex].quantity} u.)`,
        },
      ]}
      hideLegend
      grid={{ vertical: true }}
    />
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  return (
    <PieChart
      height={CHART_HEIGHT}
      series={[
        {
          data: slices.map((slice) => ({
            id: slice.id,
            value: slice.value,
            label: slice.label,
            color: slice.color,
          })),
          innerRadius: 60,
          paddingAngle: 2,
          cornerRadius: 4,
          highlightScope: { fade: 'global', highlight: 'item' },
          valueFormatter: (item) => formatCurrency(item.value),
        },
      ]}
    />
  );
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  return (
    <ScatterChart
      height={CHART_HEIGHT}
      xAxis={[
        { label: 'Precio (S/)', min: 0, valueFormatter: (v: number) => formatCurrencyShort(v) },
      ]}
      yAxis={[{ label: 'Unidades', min: 0 }]}
      series={[
        {
          label: 'Productos',
          color: CHART_COLORS.secondary,
          data: data.map((product) => ({
            id: product.productId,
            x: product.price,
            y: product.quantity,
          })),
          valueFormatter: (point) => {
            const product = data.find((item) => item.productId === point?.id);
            return product
              ? `${product.name}: ${formatCurrency(product.price)} · ${product.quantity} u.`
              : '';
          },
        },
      ]}
      hideLegend
      grid={{ horizontal: true, vertical: true }}
    />
  );
}

export function MuiChartsDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="mui"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
