import { CalendarHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/20">
        <CalendarHeart className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-display text-xl font-bold tracking-tight text-ink-900">
        Eventra
      </span>
    </Link>
  );
}
