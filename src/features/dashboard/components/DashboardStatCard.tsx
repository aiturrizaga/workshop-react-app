import type { ComponentType } from 'react';
import { Card, CardBody } from '@/components/ui/Card';

interface DashboardStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
}

export function DashboardStatCard({ label, value, hint, icon: Icon }: DashboardStatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
          <Icon className="size-5 text-brand-600" />
        </div>
      </CardBody>
    </Card>
  );
}
