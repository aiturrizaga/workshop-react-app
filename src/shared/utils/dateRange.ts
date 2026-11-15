/**
 * Utilidades de fechas "de calendario" (YYYY-MM-DD) para filtros de
 * dashboard y reportes. El backend interpreta estas fechas en hora de Lima.
 */

/** Fecha local de hoy como YYYY-MM-DD. */
export function todayIso(): string {
  return toIsoDay(new Date());
}

export function toIsoDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysIso(day: string, days: number): string {
  const [year, month, date] = day.split('-').map(Number);
  return toIsoDay(new Date(year, month - 1, date + days));
}

export function startOfMonthIso(day: string = todayIso()): string {
  return `${day.slice(0, 7)}-01`;
}

/** "2026-11-14" -> "14/11" (etiquetas cortas para ejes X). */
export function formatShortDay(day: string): string {
  const [, month, date] = day.split('-');
  return `${date}/${month}`;
}

/** "2026-11-14" -> "14/11/2026" */
export function formatIsoDay(day: string): string {
  const [year, month, date] = day.split('-');
  return `${date}/${month}/${year}`;
}
