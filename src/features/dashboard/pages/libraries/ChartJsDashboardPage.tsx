import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import type { ReactNode } from 'react';
import { Bar, Doughnut, Line, Scatter } from 'react-chartjs-2';
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
 * Chart.js es "tree-shakeable": hay que registrar solo las piezas que se
 * usan (escalas, elementos y plugins). Dibuja en <canvas>.
 */
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
);

function Box({ children }: { children: ReactNode }) {
  // Con maintainAspectRatio: false el canvas toma el alto de su contenedor.
  return <div style={{ position: 'relative', height: CHART_HEIGHT }}>{children}</div>;
}

function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  return (
    <Box>
      <Line
        data={{
          labels: data.map((day) => formatShortDay(day.date)),
          datasets: [
            {
              label: 'Ingresos',
              data: data.map((day) => day.total),
              borderColor: CHART_COLORS.primary,
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              fill: true,
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => formatCurrency(Number(ctx.parsed.y)) } },
          },
          scales: {
            y: { beginAtZero: true, ticks: { callback: (v) => formatCurrencyShort(Number(v)) } },
            x: { grid: { display: false } },
          },
        }}
      />
    </Box>
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  return (
    <Box>
      <Bar
        data={{
          labels: data.map((product) => product.name),
          datasets: [
            {
              label: 'Ingresos',
              data: data.map((product) => product.total),
              backgroundColor: CHART_COLORS.primary,
              borderRadius: 6,
            },
          ],
        }}
        options={{
          indexAxis: 'y', // barras horizontales
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${formatCurrency(Number(ctx.parsed.x))} (${data[ctx.dataIndex].quantity} u.)`,
              },
            },
          },
          scales: {
            x: { beginAtZero: true, ticks: { callback: (v) => formatCurrencyShort(Number(v)) } },
            y: { grid: { display: false } },
          },
        }}
      />
    </Box>
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  return (
    <Box>
      <Doughnut
        data={{
          labels: slices.map((slice) => slice.label),
          datasets: [
            {
              data: slices.map((slice) => slice.value),
              backgroundColor: slices.map((slice) => slice.color),
              borderWidth: 2,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: (ctx) => formatCurrency(Number(ctx.parsed)) } },
          },
        }}
      />
    </Box>
  );
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  return (
    <Box>
      <Scatter
        data={{
          datasets: [
            {
              label: 'Productos',
              data: data.map((product) => ({ x: product.price, y: product.quantity })),
              backgroundColor: CHART_COLORS.secondary,
              pointRadius: 5,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const product = data[ctx.dataIndex];
                  return `${product.name}: ${formatCurrency(product.price)} · ${product.quantity} u.`;
                },
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Precio (S/)' },
              ticks: { callback: (v) => formatCurrencyShort(Number(v)) },
            },
            y: { beginAtZero: true, title: { display: true, text: 'Unidades vendidas' } },
          },
        }}
      />
    </Box>
  );
}

export function ChartJsDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="chartjs"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
