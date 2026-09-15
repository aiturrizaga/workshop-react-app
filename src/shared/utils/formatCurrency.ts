/**
 * Formatea un valor monetario para mostrarlo en la interfaz.
 *
 * El backend es la fuente de verdad de los montos (nunca se recalculan
 * en el frontend); esta función solo se encarga de la PRESENTACIÓN.
 *
 * Ejemplo: formatCurrency(1500) -> "S/ 1,500.00"
 */
export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `S/ ${formatted}`;
}
