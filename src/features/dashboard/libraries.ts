/**
 * Librerías de gráficos que se comparan en el dashboard (sesión 6).
 * Cada una tiene su propia página en /dashboard/<id> con los mismos datos.
 */
export interface ChartLibraryInfo {
  id: string;
  name: string;
  packageName: string;
  description: string;
}

export const CHART_LIBRARIES: ChartLibraryInfo[] = [
  {
    id: 'recharts',
    name: 'Recharts',
    packageName: 'recharts',
    description: 'Componentes React simples y declarativos (SVG). La recomendada para este curso.',
  },
  {
    id: 'chartjs',
    name: 'Chart.js',
    packageName: 'react-chartjs-2',
    description: 'Muy popular y liviana. Dibuja en canvas; buena con muchos datos.',
  },
  {
    id: 'echarts',
    name: 'Apache ECharts',
    packageName: 'echarts-for-react',
    description: 'Muy completa: mapas, heatmaps, zoom. Ideal para dashboards grandes.',
  },
  {
    id: 'nivo',
    name: 'Nivo',
    packageName: '@nivo/*',
    description: 'Gráficos con muy buen diseño por defecto, animados y temáticos.',
  },
  {
    id: 'apexcharts',
    name: 'ApexCharts',
    packageName: 'react-apexcharts',
    description: 'Interactiva desde el inicio: zoom, exportar a PNG, tooltips ricos.',
  },
  {
    id: 'mui',
    name: 'MUI X Charts',
    packageName: '@mui/x-charts',
    description: 'La opción natural si el proyecto ya usa Material UI.',
  },
  {
    id: 'visx',
    name: 'Visx',
    packageName: '@visx/*',
    description: 'Primitivas de bajo nivel (D3 + React) para gráficos a medida. Más código.',
  },
];
