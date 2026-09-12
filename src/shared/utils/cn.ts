/**
 * Combina clases de Tailwind condicionalmente, ignorando valores falsy.
 * Evita repetir `[a, b, c].filter(Boolean).join(' ')` en cada componente.
 *
 * Uso: cn('px-4 py-2', isActive && 'bg-brand-600', className)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
