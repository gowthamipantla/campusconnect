import { Link } from 'react-router-dom';
import SealBadge from '../common/SealBadge';

export default function EventCard({ event }) {
  if (!event) return null;

  const registeredCount = event.registeredCount ?? 0;
  const capacity = event.capacity ?? 0;
  const isFull = capacity > 0 && registeredCount >= capacity;
  const badgeStatus = isFull ? 'full' : 'open';

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block bg-white/80 border border-stone/20 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header: Category Pill & SealBadge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
            {event.category || 'General'}
          </span>
          <SealBadge status={badgeStatus} size="sm" />
        </div>

        {/* Event Title */}
        <h3 className="font-display font-bold text-xl text-ink group-hover:text-gold transition-colors duration-200 line-clamp-2 mb-2">
          {event.title}
        </h3>

        {/* Club Name */}
        {event.clubName && (
          <p className="text-xs font-semibold text-stone uppercase tracking-wide mb-4">
            Hosted by {event.clubName}
          </p>
        )}

        {/* Description snippet if present */}
        {event.description && (
          <p className="text-sm text-charcoal/80 line-clamp-2 mb-4">
            {event.description}
          </p>
        )}
      </div>

      {/* Footer Info: Date, Venue, Spots Filled */}
      <div className="pt-4 border-t border-stone/15 space-y-2 text-xs text-stone">
        {/* Date & Time */}
        <div className="flex items-center gap-2 text-charcoal/90">
          <svg
            className="w-4 h-4 text-gold shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium truncate">{formatEventDate(event.eventDate)}</span>
        </div>

        {/* Venue */}
        {event.venue && (
          <div className="flex items-center gap-2 text-charcoal/90">
            <svg
              className="w-4 h-4 text-gold shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{event.venue}</span>
          </div>
        )}

        {/* Spots Filled */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className={`font-semibold ${isFull ? 'text-danger' : 'text-charcoal'}`}>
            {registeredCount} / {capacity} spots filled
          </span>
          <span className={`text-[11px] uppercase tracking-wider font-semibold ${isFull ? 'text-danger' : 'text-success'}`}>
            {isFull ? 'Sold Out' : 'Open'}
          </span>
        </div>
      </div>
    </Link>
  );
}
