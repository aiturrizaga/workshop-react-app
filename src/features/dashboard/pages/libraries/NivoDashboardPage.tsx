import type { ReactNode } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
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
 * Nivo: los componentes Responsive* llenan a su contenedor, que DEBE tener
 * un alto fijo. Buen diseño y animaciones por defecto; tema configurable.
 */
function Box({ children }: { children: ReactNode }) {
  return <div style={{ height: CHART_HEIGHT }}>{children}</div>;
}

const THEME = {
  text: { fontSize: 12, fill: CHART_COLORS.axis },
  grid: { line: { stroke: CHART_COLORS.grid } },
};

function TooltipBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm">
      {children}
    </div>
  );
}

function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  // Si hay muchos días, se muestra una etiqueta cada N para que no se encimen.
  const step = Math.max(1, Math.ceil(data.length / 10));
  return (
    <Box>
      <ResponsiveLine
        data={[{ id: 'Ingresos', data: data.map((day) => ({ x: day.date, y: day.total })) }]}
        margin={{ top: 10, right: 16, bottom: 36, left: 72 }}
        theme={THEME}
        colors={[CHART_COLORS.primary]}
        curve="monotoneX"
        enableArea
        areaOpacity={0.15}
        pointSize={5}
        useMesh
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        axisBottom={{
          format: (value: string) => formatShortDay(value),
          tickValues: data.filter((_, index) => index % step === 0).map((day) => day.date),
        }}
        axisLeft={{ format: (value: number) => formatCurrencyShort(value) }}
        tooltip={({ point }) => (
          <TooltipBox>
            <strong>{formatShortDay(String(point.data.x))}</strong>:{' '}
            {formatCurrency(Number(point.data.y))}
          </TooltipBox>
        )}
      />
    </Box>
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  return (
    <Box>
      <ResponsiveBar
        // Nivo dibuja la primera fila abajo en layout horizontal: se invierte el orden.
        data={[...data].reverse().map((product) => ({
          name: product.name,
          total: product.total,
          quantity: product.quantity,
        }))}
        keys={['total']}
        indexBy="name"
        layout="horizontal"
        margin={{ top: 10, right: 16, bottom: 36, left: 140 }}
        padding={0.3}
        theme={THEME}
        colors={[CHART_COLORS.primary]}
        borderRadius={4}
        enableLabel={false}
        axisBottom={{ format: (value: number) => formatCurrencyShort(value), tickValues: 4 }}
        tooltip={({ data: row }) => (
          <TooltipBox>
            <strong>{row.name}</strong>: {formatCurrency(Number(row.total))} ({row.quantity} u.)
          </TooltipBox>
        )}
      />
    </Box>
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  return (
    <Box>
      <ResponsivePie
        data={slices}
        margin={{ top: 16, right: 16, bottom: 48, left: 16 }}
        innerRadius={0.6}
        padAngle={1.5}
        cornerRadius={3}
        colors={{ datum: 'data.color' }}
        theme={THEME}
        enableArcLinkLabels={false}
        arcLabel={(datum) => `${Math.round((datum.value / totalOf(slices)) * 100)}%`}
        arcLabelsTextColor="#ffffff"
        valueFormat={(value) => formatCurrency(value)}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 40,
            itemWidth: 110,
            itemHeight: 16,
            symbolSize: 10,
            symbolShape: 'circle',
          },
        ]}
      />
    </Box>
  );
}

function totalOf(slices: { value: number }[]): number {
  return slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  return (
    <Box>
      <ResponsiveScatterPlot
        data={[
          {
            id: 'Productos',
            data: data.map((product) => ({
              x: product.price,
              y: product.quantity,
              name: product.name,
            })),
          },
        ]}
        margin={{ top: 10, right: 16, bottom: 44, left: 56 }}
        theme={THEME}
        colors={[CHART_COLORS.secondary]}
        nodeSize={10}
        xScale={{ type: 'linear', min: 0, max: 'auto' }}
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        axisBottom={{
          format: (value: number) => formatCurrencyShort(value),
          legend: 'Precio',
          legendOffset: 36,
          legendPosition: 'middle',
          tickValues: 5,
        }}
        axisLeft={{ legend: 'Unidades', legendOffset: -44, legendPosition: 'middle' }}
        tooltip={({ node }) => (
          <TooltipBox>
            <strong>{node.data.name}</strong>: {formatCurrency(Number(node.data.x))} · {node.data.y}{' '}
            u.
          </TooltipBox>
        )}
      />
    </Box>
  );
}

export function NivoDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="nivo"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
