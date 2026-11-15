import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
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
 * ApexCharts: interactiva desde el inicio. La barra de herramientas
 * (toolbar) trae zoom, desplazamiento y "Download PNG/SVG/CSV" sin código extra.
 */
const BASE: ApexOptions = {
  chart: {
    fontFamily: 'inherit',
    toolbar: { show: true },
    animations: { enabled: true },
  },
  grid: { borderColor: CHART_COLORS.grid },
  dataLabels: { enabled: false },
};

function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  const options: ApexOptions = {
    ...BASE,
    chart: { ...BASE.chart, type: 'area', zoom: { enabled: true } },
    colors: [CHART_COLORS.primary],
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
    xaxis: {
      categories: data.map((day) => formatShortDay(day.date)),
      tickAmount: Math.min(10, data.length),
    },
    yaxis: { min: 0, labels: { formatter: (value) => formatCurrencyShort(value) } },
    tooltip: { y: { formatter: (value) => formatCurrency(Number(value)) } },
  };
  return (
    <Chart
      type="area"
      height={CHART_HEIGHT}
      options={options}
      series={[{ name: 'Ingresos', data: data.map((day) => day.total) }]}
    />
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  const options: ApexOptions = {
    ...BASE,
    chart: { ...BASE.chart, type: 'bar' },
    colors: [CHART_COLORS.primary],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
    xaxis: {
      categories: data.map((product) => product.name),
      labels: { formatter: (value) => formatCurrencyShort(Number(value)) },
    },
    tooltip: {
      y: {
        formatter: (value, opts) =>
          `${formatCurrency(Number(value))} (${data[opts?.dataPointIndex ?? 0]?.quantity ?? 0} u.)`,
      },
    },
  };
  return (
    <Chart
      type="bar"
      height={CHART_HEIGHT}
      options={options}
      series={[{ name: 'Ingresos', data: data.map((product) => product.total) }]}
    />
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  const options: ApexOptions = {
    ...BASE,
    chart: { ...BASE.chart, type: 'donut' },
    labels: slices.map((slice) => slice.label),
    colors: slices.map((slice) => slice.color),
    dataLabels: { enabled: true },
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => formatCurrencyShort(slices.reduce((s, x) => s + x.value, 0)),
            },
            value: { formatter: (value) => formatCurrencyShort(Number(value)) },
          },
        },
      },
    },
    tooltip: { y: { formatter: (value) => formatCurrency(Number(value)) } },
  };
  return (
    <Chart
      type="donut"
      height={CHART_HEIGHT}
      options={options}
      series={slices.map((slice) => slice.value)}
    />
  );
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  const options: ApexOptions = {
    ...BASE,
    chart: { ...BASE.chart, type: 'scatter', zoom: { enabled: true, type: 'xy' } },
    colors: [CHART_COLORS.secondary],
    markers: { size: 6 },
    xaxis: {
      type: 'numeric',
      title: { text: 'Precio (S/)' },
      tickAmount: 5,
      labels: { formatter: (value) => formatCurrencyShort(Number(value)) },
    },
    yaxis: { min: 0, title: { text: 'Unidades' }, labels: { formatter: (v) => String(v) } },
    tooltip: {
      custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
        const product = data[dataPointIndex];
        return `<div style="padding:6px 8px;font-size:12px"><strong>${product.name}</strong><br/>${formatCurrency(product.price)} · ${product.quantity} u.</div>`;
      },
    },
  };
  return (
    <Chart
      type="scatter"
      height={CHART_HEIGHT}
      options={options}
      series={[
        {
          name: 'Productos',
          data: data.map((product) => [product.price, product.quantity]),
        },
      ]}
    />
  );
}

export function ApexChartsDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="apexcharts"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
