import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import Button from '../components/common/Button';
import SealBadge from '../components/common/SealBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchEventAndStatus = async () => {
      setLoading(true);
      setError('');
      try {
        const eventData = await eventService.getEventById(id);
        if (isMounted) {
          setEvent(eventData);
        }

        // If user is logged in, check if they are already registered
        if (user) {
          try {
            const myRegistrations = await eventService.getMyRegistrations();
            if (Array.isArray(myRegistrations) && isMounted) {
              const alreadyRegistered = myRegistrations.some(
                (reg) =>
                  reg.event?.id === Number(id) || reg.eventId === Number(id)
              );
              if (alreadyRegistered) {
                setIsRegistered(true);
              }
            }
          } catch (regErr) {
            console.error('Error fetching registrations:', regErr);
          }
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            (typeof err.response?.data === 'string' ? err.response?.data : null) ||
            'Event not found or failed to load.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEventAndStatus();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setRegistrationError('');
    setSuccessMessage('');

    try {
      await eventService.registerForEvent(id);
      setIsRegistered(true);
      setSuccessMessage('Successfully registered for this event!');
      // Update registered count locally
      setEvent((prev) =>
        prev
          ? { ...prev, registeredCount: (prev.registeredCount || 0) + 1 }
          : prev
      );
    } catch (err) {
      console.error('Registration failed:', err);
      const errMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message ||
        'Failed to register for event. Please try again.';
      setRegistrationError(errMsg);
    } finally {
      setRegistering(false);
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-ivory flex items-center justify-center py-20">
        <Loader message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-ivory px-4 py-16 flex items-center justify-center">
        <EmptyState
          title="Event Not Found"
          message={error || "The event you're looking for doesn't exist or has been removed."}
          action={
            <Link to="/events">
              <Button variant="primary">Return to Events</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const registeredCount = event.registeredCount ?? 0;
  const capacity = event.capacity ?? 0;
  const isFull = capacity > 0 && registeredCount >= capacity;
  const badgeStatus = isFull ? 'full' : 'open';

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-stone hover:text-gold font-medium text-sm transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all events
          </Link>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Event Title & Full Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                  {event.category || 'General'}
                </span>
                {event.clubName && (
                  <span className="text-xs font-semibold text-stone uppercase tracking-wider">
                    • Organized by {event.clubName}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Event Info Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-white/80 border border-stone/20 rounded-xl shadow-xs">
              {/* Date & Time */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-gold/10 text-gold rounded-lg shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5"
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
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase text-stone tracking-wider block mb-1">
                    Date & Time
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {formatEventDate(event.eventDate)}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-gold/10 text-gold rounded-lg shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5"
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
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase text-stone tracking-wider block mb-1">
                    Location
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {event.venue || 'Campus Venue TBA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-ink">
                About This Event
              </h2>
              <div className="text-charcoal/90 text-base leading-relaxed whitespace-pre-line bg-white/50 p-6 sm:p-8 rounded-xl border border-stone/15">
                {event.description || 'No detailed description provided.'}
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-stone/20 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
              {/* Badge & Capacity Status */}
              <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-stone/20">
                <SealBadge status={badgeStatus} size="lg" />
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">
                    {isRegistered
                      ? 'Seat Reserved'
                      : isFull
                      ? 'Registration Closed'
                      : 'Registration Open'}
                  </h3>
                  <p className="text-stone text-xs mt-1">
                    Official University Registration Seal
                  </p>
                </div>

                <div className="w-full pt-2">
                  <div className="flex justify-between text-xs font-semibold text-charcoal mb-1.5">
                    <span>Attendance Capacity</span>
                    <span>
                      {registeredCount} / {capacity}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-charcoal/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isFull ? 'bg-danger' : 'bg-gold'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          capacity > 0 ? (registeredCount / capacity) * 100 : 0
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-right text-[11px] text-stone mt-1">
                    {Math.max(0, capacity - registeredCount)} spots remaining
                  </p>
                </div>
              </div>

              {/* Registration Alerts */}
              {successMessage && (
                <div className="p-3.5 bg-success/15 border border-success/30 rounded-lg text-success text-sm font-medium text-center">
                  {successMessage}
                </div>
              )}

              {registrationError && (
                <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm font-medium text-center">
                  {registrationError}
                </div>
              )}

              {/* Registration Action Button */}
              <div>
                {isRegistered ? (
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      disabled
                      className="w-full py-3.5 bg-success/20 text-success border border-success/40"
                    >
                      You're Registered!
                    </Button>
                    <p className="text-center text-xs text-stone">
                      Your seat is confirmed. Attendance will be recorded at the venue.
                    </p>
                  </div>
                ) : isFull ? (
                  <Button
                    variant="primary"
                    disabled
                    className="w-full py-3.5 opacity-60"
                  >
                    Event Full
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-3.5 shadow-md hover:shadow-lg"
                  >
                    {registering
                      ? 'Registering...'
                      : user
                      ? 'Register for this Event'
                      : 'Sign in to Register'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
