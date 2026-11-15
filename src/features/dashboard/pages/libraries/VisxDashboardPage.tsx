import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AreaClosed, Bar, Circle, LinePath, Pie } from '@visx/shape';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
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
 * Visx no trae "gráficos": trae PIEZAS (escalas de D3, ejes, formas,
 * tooltips) y uno arma el SVG a mano. Más código, pero control total.
 */
const MARGIN = { top: 12, right: 16, bottom: 32, left: 72 };
const AXIS_TICK = () => ({ fill: CHART_COLORS.axis, fontSize: 11 });
const AXIS_TICK_LEFT = () => ({
  fill: CHART_COLORS.axis,
  fontSize: 11,
  textAnchor: 'end' as const,
  dx: -4,
  dy: 3,
});

/**
 * Mide el ancho disponible y dibuja con alto fijo. Se mide al montar
 * (getBoundingClientRect) y luego se sigue con un ResizeObserver; así el
 * gráfico aparece de inmediato sin esperar el primer evento de resize
 * (ParentSize de @visx/responsive hace lo mismo pero con debounce).
 */
function Responsive({ children }: { children: (width: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setWidth(Math.floor(element.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height: CHART_HEIGHT }} className="relative">
      {width > 0 ? children(width) : null}
    </div>
  );
}

function TooltipContent({ children }: { children: ReactNode }) {
  return <div className="text-xs">{children}</div>;
}

function SalesByDayChart({ data }: { data: SalesByDay[] }) {
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<SalesByDay>();

  return (
    <Responsive>
      {(width) => {
        const innerWidth = width - MARGIN.left - MARGIN.right;
        const innerHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;
        const x = scaleBand({
          domain: data.map((day) => day.date),
          range: [0, innerWidth],
          padding: 0,
        });
        const max = Math.max(...data.map((day) => day.total), 1);
        const y = scaleLinear({ domain: [0, max], range: [innerHeight, 0], nice: true });
        const center = (day: SalesByDay) => (x(day.date) ?? 0) + x.bandwidth() / 2;
        const step = Math.max(1, Math.ceil(data.length / 8));

        return (
          <>
            <svg width={width} height={CHART_HEIGHT}>
              <Group left={MARGIN.left} top={MARGIN.top}>
                <GridRows scale={y} width={innerWidth} stroke={CHART_COLORS.grid} numTicks={5} />
                <AreaClosed
                  data={data}
                  x={center}
                  y={(day) => y(day.total)}
                  yScale={y}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.15}
                />
                <LinePath
                  data={data}
                  x={center}
                  y={(day) => y(day.total)}
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                />
                {/* Zonas invisibles por día para el tooltip */}
                {data.map((day) => (
                  <rect
                    key={day.date}
                    x={x(day.date)}
                    y={0}
                    width={x.bandwidth()}
                    height={innerHeight}
                    fill="transparent"
                    onMouseMove={() =>
                      showTooltip({
                        tooltipData: day,
                        tooltipLeft: MARGIN.left + center(day),
                        tooltipTop: MARGIN.top + y(day.total),
                      })
                    }
                    onMouseLeave={hideTooltip}
                  />
                ))}
                <AxisLeft
                  scale={y}
                  numTicks={5}
                  tickFormat={(value) => formatCurrencyShort(Number(value))}
                  stroke={CHART_COLORS.grid}
                  tickStroke={CHART_COLORS.grid}
                  tickLabelProps={AXIS_TICK_LEFT}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={x}
                  tickValues={data.filter((_, i) => i % step === 0).map((day) => day.date)}
                  tickFormat={(value) => formatShortDay(String(value))}
                  stroke={CHART_COLORS.grid}
                  tickStroke={CHART_COLORS.grid}
                  tickLabelProps={AXIS_TICK}
                />
              </Group>
            </svg>
            {tooltipData && (
              <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
                <TooltipContent>
                  <strong>{formatShortDay(tooltipData.date)}</strong>:{' '}
                  {formatCurrency(tooltipData.total)} ({tooltipData.count} ventas)
                </TooltipContent>
              </TooltipWithBounds>
            )}
          </>
        );
      }}
    </Responsive>
  );
}

function TopProductsChart({ data }: { data: TopProduct[] }) {
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<TopProduct>();
  const margin = { ...MARGIN, left: 140 };

  return (
    <Responsive>
      {(width) => {
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = CHART_HEIGHT - margin.top - margin.bottom;
        const y = scaleBand({
          domain: data.map((product) => product.productId),
          range: [0, innerHeight],
          padding: 0.3,
        });
        const max = Math.max(...data.map((product) => product.total), 1);
        const x = scaleLinear({ domain: [0, max], range: [0, innerWidth], nice: true });
        const nameById = new Map(data.map((product) => [product.productId, product.name]));

        return (
          <>
            <svg width={width} height={CHART_HEIGHT}>
              <Group left={margin.left} top={margin.top}>
                {data.map((product) => (
                  <Bar
                    key={product.productId}
                    x={0}
                    y={y(product.productId)}
                    width={x(product.total)}
                    height={y.bandwidth()}
                    rx={4}
                    fill={CHART_COLORS.primary}
                    onMouseMove={() =>
                      showTooltip({
                        tooltipData: product,
                        tooltipLeft: margin.left + x(product.total),
                        tooltipTop: margin.top + (y(product.productId) ?? 0),
                      })
                    }
                    onMouseLeave={hideTooltip}
                  />
                ))}
                <AxisLeft
                  scale={y}
                  tickFormat={(id) => {
                    const name = nameById.get(String(id)) ?? '';
                    return name.length > 18 ? `${name.slice(0, 17)}…` : name;
                  }}
                  stroke={CHART_COLORS.grid}
                  tickStroke="transparent"
                  tickLabelProps={AXIS_TICK_LEFT}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={x}
                  numTicks={4}
                  tickFormat={(value) => formatCurrencyShort(Number(value))}
                  stroke={CHART_COLORS.grid}
                  tickStroke={CHART_COLORS.grid}
                  tickLabelProps={AXIS_TICK}
                />
              </Group>
            </svg>
            {tooltipData && (
              <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
                <TooltipContent>
                  <strong>{tooltipData.name}</strong>: {formatCurrency(tooltipData.total)} (
                  {tooltipData.quantity} u.)
                </TooltipContent>
              </TooltipWithBounds>
            )}
          </>
        );
      }}
    </Responsive>
  );
}

function SalesBySellerChart({ data }: { data: SalesBySeller[] }) {
  const slices = toDonutSlices(data);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  const legendHeight = 28;

  return (
    <Responsive>
      {(width) => {
        const radius = Math.min(width, CHART_HEIGHT - legendHeight) / 2 - 8;
        return (
          <div className="flex h-full flex-col items-center">
            <svg width={width} height={CHART_HEIGHT - legendHeight}>
              <Group left={width / 2} top={(CHART_HEIGHT - legendHeight) / 2}>
                <Pie
                  data={slices}
                  pieValue={(slice) => slice.value}
                  outerRadius={radius}
                  innerRadius={radius * 0.6}
                  padAngle={0.02}
                  cornerRadius={3}
                >
                  {(pie) =>
                    pie.arcs.map((arc) => {
                      const [labelX, labelY] = pie.path.centroid(arc);
                      const percent = Math.round((arc.data.value / total) * 100);
                      return (
                        <g key={arc.data.id}>
                          <path d={pie.path(arc) ?? ''} fill={arc.data.color}>
                            <title>{`${arc.data.label}: ${formatCurrency(arc.data.value)}`}</title>
                          </path>
                          {percent >= 6 && (
                            <text
                              x={labelX}
                              y={labelY}
                              dy=".33em"
                              fill="#fff"
                              fontSize={11}
                              textAnchor="middle"
                              pointerEvents="none"
                            >
                              {percent}%
                            </text>
                          )}
                        </g>
                      );
                    })
                  }
                </Pie>
              </Group>
            </svg>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
              {slices.map((slice) => (
                <li key={slice.id} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: slice.color }} />
                  {slice.label}
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    </Responsive>
  );
}

function ProductPerformanceChart({ data }: { data: ProductPerformance[] }) {
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<ProductPerformance>();
  const margin = { ...MARGIN, left: 48, bottom: 40 };

  return (
    <Responsive>
      {(width) => {
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = CHART_HEIGHT - margin.top - margin.bottom;
        const x = scaleLinear({
          domain: [0, Math.max(...data.map((product) => product.price), 1)],
          range: [0, innerWidth],
          nice: true,
        });
        const y = scaleLinear({
          domain: [0, Math.max(...data.map((product) => product.quantity), 1)],
          range: [innerHeight, 0],
          nice: true,
        });

        return (
          <>
            <svg width={width} height={CHART_HEIGHT}>
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={y} width={innerWidth} stroke={CHART_COLORS.grid} numTicks={5} />
                {data.map((product) => (
                  <Circle
                    key={product.productId}
                    cx={x(product.price)}
                    cy={y(product.quantity)}
                    r={6}
                    fill={CHART_COLORS.secondary}
                    fillOpacity={0.85}
                    onMouseMove={() =>
                      showTooltip({
                        tooltipData: product,
                        tooltipLeft: margin.left + x(product.price),
                        tooltipTop: margin.top + y(product.quantity),
                      })
                    }
                    onMouseLeave={hideTooltip}
                  />
                ))}
                <AxisLeft
                  scale={y}
                  numTicks={5}
                  label="Unidades"
                  stroke={CHART_COLORS.grid}
                  tickStroke={CHART_COLORS.grid}
                  tickLabelProps={AXIS_TICK_LEFT}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={x}
                  numTicks={5}
                  label="Precio"
                  tickFormat={(value) => formatCurrencyShort(Number(value))}
                  stroke={CHART_COLORS.grid}
                  tickStroke={CHART_COLORS.grid}
                  tickLabelProps={AXIS_TICK}
                />
              </Group>
            </svg>
            {tooltipData && (
              <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
                <TooltipContent>
                  <strong>{tooltipData.name}</strong>: {formatCurrency(tooltipData.price)} ·{' '}
                  {tooltipData.quantity} u.
                </TooltipContent>
              </TooltipWithBounds>
            )}
          </>
        );
      }}
    </Responsive>
  );
}

export function VisxDashboardPage() {
  return (
    <LibraryDashboard
      libraryId="visx"
      charts={{ SalesByDayChart, TopProductsChart, SalesBySellerChart, ProductPerformanceChart }}
    />
  );
}
