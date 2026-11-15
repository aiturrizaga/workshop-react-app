import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/apiError';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../types';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.get();
      setData(response.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar el dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error };
}
