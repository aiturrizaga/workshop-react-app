import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { addDaysIso, startOfMonthIso, todayIso } from '@/shared/utils/dateRange';
import type { DateRange } from '../types';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Máximo de días permitido (el backend rechaza rangos mayores a 366). */
  maxDays?: number;
}

const PRESETS: { label: string; build: () => DateRange }[] = [
  { label: '7 días', build: () => ({ from: addDaysIso(todayIso(), -6), to: todayIso() }) },
  { label: '30 días', build: () => ({ from: addDaysIso(todayIso(), -29), to: todayIso() }) },
  { label: 'Este mes', build: () => ({ from: startOfMonthIso(), to: todayIso() }) },
  { label: '90 días', build: () => ({ from: addDaysIso(todayIso(), -89), to: todayIso() }) },
];

/** Filtro de fechas visible (desde / hasta + atajos), compartido por dashboard y reportes. */
export function DateRangeFilter({ value, onChange, maxDays = 366 }: DateRangeFilterProps) {
  const [draft, setDraft] = useState<DateRange>(value);
  const [synced, setSynced] = useState<DateRange>(value);

  // Si el rango cambia desde afuera (URL, atajo), se actualiza el borrador.
  if (synced.from !== value.from || synced.to !== value.to) {
    setSynced(value);
    setDraft(value);
  }

  const invalidOrder = draft.from > draft.to;
  const tooLong = !invalidOrder && addDaysIso(draft.from, maxDays - 1) < draft.to;
  const error = invalidOrder
    ? '"Desde" no puede ser mayor que "Hasta".'
    : tooLong
      ? `El rango no puede superar ${maxDays} días.`
      : undefined;
  const dirty = draft.from !== value.from || draft.to !== value.to;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="grid grid-cols-2 gap-3 sm:w-80">
        <div>
          <Label htmlFor="range-from">Desde</Label>
          <Input
            id="range-from"
            type="date"
            value={draft.from}
            max={draft.to}
            onChange={(event) => setDraft({ ...draft, from: event.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="range-to">Hasta</Label>
          <Input
            id="range-to"
            type="date"
            value={draft.to}
            min={draft.from}
            onChange={(event) => setDraft({ ...draft, to: event.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          disabled={!dirty || Boolean(error) || !draft.from || !draft.to}
          onClick={() => onChange(draft)}
        >
          Aplicar
        </Button>
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            size="sm"
            variant="secondary"
            onClick={() => onChange(preset.build())}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 lg:pb-1.5">{error}</p>}
    </div>
  );
}
