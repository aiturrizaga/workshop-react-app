import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  active: string;
  onActiveChange: (value: string) => void;
}

/**
 * Mantiene separado el ESTADO de los filtros
 */
export function ProductFilters({
  search,
  onSearchChange,
  active,
  onActiveChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:w-72">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <Input
          className="pl-9"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar productos"
        />
      </div>
      <Select
        className="sm:w-44"
        value={active}
        onChange={(event) => onActiveChange(event.target.value)}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </Select>
    </div>
  );
}
