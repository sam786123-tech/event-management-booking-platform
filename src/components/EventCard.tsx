import { MapPin, Users, Ticket } from 'lucide-react';
import type { EventRow } from '@/lib/types';
import { formatPrice, getMonthAndDay, getRelativeDate } from '@/lib/format';

interface EventCardProps {
  event: EventRow;
  onBook?: (event: EventRow) => void;
  bookingLabel?: string;
}

export default function EventCard({ event, onBook, bookingLabel = 'Book Now' }: EventCardProps) {
  const { month, day } = getMonthAndDay(event.event_date);
  const categoryColors: Record<string, string> = {
    Music: 'bg-accent-100 text-accent-700',
    Conference: 'bg-brand-100 text-brand-700',
    Exhibition: 'bg-gold-400/20 text-gold-600',
    Festival: 'bg-blue-100 text-blue-700',
  };
  const badgeClass = categoryColors[event.category] ?? 'bg-ink-100 text-ink-600';

  return (
    <article className="card group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-ink-900/5 hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white/95 shadow-lg backdrop-blur-sm">
          <span className="text-[10px] font-bold leading-none text-brand-600">{month}</span>
          <span className="mt-0.5 text-xl font-bold leading-none text-ink-900">{day}</span>
        </div>
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          {event.category}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-brand-600">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          {getRelativeDate(event.event_date)}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-ink-900 line-clamp-1">
          {event.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ink-400" />
            {event.venue}, {event.city}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-ink-400" />
            {event.capacity.toLocaleString()}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
          <div>
            <span className="text-xs text-ink-400">From</span>
            <p className="text-lg font-bold text-ink-900">{formatPrice(event.price)}</p>
          </div>
          {onBook && (
            <button
              onClick={() => onBook(event)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-xl active:scale-95"
            >
              <Ticket className="h-4 w-4" />
              {bookingLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
