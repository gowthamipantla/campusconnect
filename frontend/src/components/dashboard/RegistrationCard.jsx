import { useState } from 'react';
import { Link } from 'react-router-dom';
import SealBadge from '../common/SealBadge';
import Button from '../common/Button';
import { downloadCertificate } from '../../services/eventService';

export default function RegistrationCard({ registration }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!registration) return null;

  const event = registration.event || {};
  const isAttended = Boolean(registration.attended);
  const hasCertificate = Boolean(registration.certificateUrl);

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

  const handleDownloadCertificate = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      await downloadCertificate(registration.id, event.title);
    } catch (error) {
      console.error('Certificate download error:', error);
      setDownloadError("Couldn't download certificate — please try again");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white/85 border border-stone/20 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header: Category & Attendance Status Pill */}
        <div className="flex items-center justify-between gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-charcoal/5 text-stone border border-stone/20">
            {event.category || 'Event'}
          </span>

          {isAttended ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-success/15 text-success border border-success/30">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Attended
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Registered
            </span>
          )}
        </div>

        {/* Event Title */}
        {event.id ? (
          <Link
            to={`/events/${event.id}`}
            className="block font-display font-bold text-xl text-ink hover:text-gold transition-colors line-clamp-2"
          >
            {event.title || 'Campus Event'}
          </Link>
        ) : (
          <h3 className="font-display font-bold text-xl text-ink line-clamp-2">
            {event.title || 'Campus Event'}
          </h3>
        )}

        {/* Club Name */}
        {event.clubName && (
          <p className="text-xs font-semibold text-stone uppercase tracking-wide">
            Hosted by {event.clubName}
          </p>
        )}

        {/* Date & Venue Info */}
        <div className="space-y-1.5 text-xs text-charcoal/80 pt-1">
          <div className="flex items-center gap-2">
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
            <span className="font-medium">{formatEventDate(event.eventDate)}</span>
          </div>

          {event.venue && (
            <div className="flex items-center gap-2">
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
              <span>{event.venue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Certificate Status & Download Action */}
      <div className="pt-4 mt-4 border-t border-stone/15">
        {hasCertificate ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SealBadge status="open" size="sm" />
                <span className="text-xs font-semibold text-ink">
                  Verified Certificate
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={handleDownloadCertificate}
                disabled={isDownloading}
                className="text-xs px-3.5 py-1.5"
              >
                {isDownloading ? 'Downloading...' : 'Download Certificate'}
              </Button>
            </div>
            {downloadError && (
              <p className="text-xs text-danger font-medium mt-2 text-right">
                {downloadError}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-stone text-xs">
            <svg
              className="w-4 h-4 shrink-0 text-stone/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Certificate available after attendance is marked</span>
          </div>
        )}
      </div>
    </div>
  );
}
