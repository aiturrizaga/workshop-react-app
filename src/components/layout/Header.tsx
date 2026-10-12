import { Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        aria-label="Abrir menú de navegación"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <div className="hidden md:block" />

      <UserMenu />
    </header>
  );
}
