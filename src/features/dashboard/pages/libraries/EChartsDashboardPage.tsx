import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
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
 * ECharts se configura con un objeto `option` (no con componentes JSX).
 * Trae de fábrica zoom (dataZoom), leyendas interactivas, temas, mapas...
 */
function EChart({ option }: { option: EChartsOption }) {
  return (
    <ReactECharts
      option={option}
      style={{ height: CHART_HEIGHT, width: '100%' }}
      notMerge
      lazyUpdate
    />
  );
}

const GRID = { left: 8, right: 16, top: 16, bottom: 8, containLabel: true };

function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  return (
    <EChart
      option={{
        grid: { ...GRID, bottom: 40 },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => formatCurrency(Number(value)),
        },
        xAxis: { type: 'category', data: data.map((day) => formatShortDay(day.date)) },
        yAxis: { type: 'value', axisLabel: { formatter: (v: number) => formatCurrencyShort(v) } },
        // dataZoom: barra inferior para acercar un tramo de días
        dataZoom: [{ type: 'inside' }, { type: 'slider', height: 18, bottom: 4 }],
        series: [
          {
            name: 'Ingresos',
            type: 'line',
            smooth: true,
            data: data.map((day) => day.total),
            itemStyle: { color: CHART_COLORS.primary },
            areaStyle: { opacity: 0.15 },
          },
        ],
      }}
    />
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  // En ECharts el eje Y de categorías empieza abajo: se invierte para ver el #1 arriba.
  return (
    <EChart
      option={{
        grid: GRID,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            const [point] = params as unknown as { dataIndex: number }[];
            const product = data[point.dataIndex];
            return `${product.name}<br/>${formatCurrency(product.total)} · ${product.quantity} u.`;
          },
        },
        xAxis: { type: 'value', axisLabel: { formatter: (v: number) => formatCurrencyShort(v) } },
        yAxis: { type: 'category', inverse: true, data: data.map((product) => product.name) },
        series: [
          {
            type: 'bar',
            data: data.map((product) => product.total),
            itemStyle: { color: CHART_COLORS.primary, borderRadius: [0, 6, 6, 0] },
          },
        ],
      }}
    />
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  return (
    <EChart
      option={{
        tooltip: {
          trigger: 'item',
          valueFormatter: (value) => formatCurrency(Number(value)),
        },
        legend: { bottom: 0 },
        series: [
          {
            type: 'pie',
            radius: ['50%', '78%'],
            center: ['50%', '45%'],
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
            label: { formatter: '{d}%' },
            data: slices.map((slice) => ({
              name: slice.label,
              value: slice.value,
              itemStyle: { color: slice.color },
            })),
          },
        ],
      }}
    />
  );
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  return (
    <EChart
      option={{
        grid: { ...GRID, left: 16, bottom: 24 },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const { dataIndex } = params as unknown as { dataIndex: number };
            const product = data[dataIndex];
            return `${product.name}<br/>${formatCurrency(product.price)} · ${product.quantity} u.`;
          },
        },
        xAxis: {
          type: 'value',
          name: 'Precio',
          nameLocation: 'middle',
          nameGap: 26,
          axisLabel: { formatter: (v: number) => formatCurrencyShort(v) },
        },
        yAxis: { type: 'value', name: 'Unidades', minInterval: 1 },
        series: [
          {
            type: 'scatter',
            symbolSize: 12,
            data: data.map((product) => [product.price, product.quantity]),
            itemStyle: { color: CHART_COLORS.secondary },
          },
        ],
      }}
    />
  );
}

export function EChartsDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="echarts"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
