/**
 * Descarga un Blob en el navegador con el nombre indicado.
 *
 * - createObjectURL crea una URL temporal que apunta al archivo en memoria.
 * - a.download le dice al navegador que descargue en vez de navegar.
 * - revokeObjectURL libera la memoria cuando ya no se necesita.
 */
export function saveFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Imprime un PDF sin descargarlo: lo carga en un iframe oculto y abre el
 * diálogo de impresión del navegador cuando termina de cargar.
 */
export function printPdf(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = url;
  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // Se limpia después: el diálogo de impresión necesita el iframe vivo.
    setTimeout(() => {
      iframe.remove();
      URL.revokeObjectURL(url);
    }, 60_000);
  };
  document.body.appendChild(iframe);
}
