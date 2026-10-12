import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <CircleAlert className="size-10 text-slate-300" aria-hidden />
      <h1 className="text-lg font-semibold text-slate-900">Página no encontrada</h1>
      <p className="text-sm text-slate-500">La página que buscas no existe o fue movida.</p>
      <Link
        to="/home"
        className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
