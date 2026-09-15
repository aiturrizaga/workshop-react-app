import { useEffect, useState } from 'react';

/**
 * Devuelve `value` con un retraso, para no disparar una petición al API
 * en cada tecla que el usuario escribe en un buscador.
 */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}
