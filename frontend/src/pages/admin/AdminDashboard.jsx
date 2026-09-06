import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllEvents } from '../../services/eventService';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching admin events:', err);
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Unable to load events.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'CLUB_COORDINATOR')) {
      fetchEvents();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-ivory flex items-center justify-center py-20">
        <Loader message="Verifying administrative access..." />
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'CLUB_COORDINATOR')) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the event "${title}"?`)) {
      return;
    }
    setDeletingId(id);
    setDeleteError('');
    try {
      await adminService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      setDeleteError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Failed to delete event. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

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

  // Metrics calculations
  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (sum, e) => sum + (Number(e.registeredCount) || 0),
    0
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const eventsThisMonth = events.filter((e) => {
    if (!e.eventDate) return false;
    const d = new Date(e.eventDate);
    return (
      !isNaN(d.getTime()) &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  }).length;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Header section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30">
                {user.role === 'ADMIN' ? 'Administrator' : 'Club Coordinator'}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-1">
              Admin Dashboard
            </h1>
            <p className="text-stone text-sm mt-1">
              Manage campus events, track registrations, and record verified student attendance.
            </p>
          </div>

          <Link to="/admin/events/new">
            <Button variant="primary" className="text-sm px-5 py-2.5 shadow-sm">
              + Create Event
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Events"
            value={totalEvents}
            accentColor="ink"
          />
          <StatCard
            label="Total Registrations"
            value={totalRegistrations}
            accentColor="gold"
          />
          <StatCard
            label="Events This Month"
            value={eventsThisMonth}
            accentColor="success"
          />
        </div>

        {deleteError && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
            {deleteError}
          </div>
        )}

        {/* Manage Events Section */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone/20 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Manage Events
              </h2>
              <p className="text-stone text-sm mt-0.5">
                Overview of all scheduled events, attendee capacity, and roster management.
              </p>
            </div>
          </div>

          {loading ? (
            <Loader message="Loading events..." />
          ) : error ? (
            <div className="bg-white/70 border border-danger/20 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4">
              <p className="text-danger font-medium text-sm">{error}</p>
              <Button variant="secondary" onClick={fetchEvents}>
                Try Again
              </Button>
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              title="No Events Found"
              message="There are no events created yet. Start by creating your first campus event!"
              action={
                <Link to="/admin/events/new">
                  <Button variant="primary">Create Event</Button>
                </Link>
              }
            />
          ) : (
            <div className="bg-white border border-stone/20 rounded-2xl shadow-sm overflow-hidden divide-y divide-stone/15">
              {events.map((event) => {
                const isFull =
                  event.capacity &&
                  (event.registeredCount || 0) >= event.capacity;
                const isDeleting = deletingId === event.id;

                return (
                  <div
                    key={event.id}
                    className="p-5 sm:p-6 hover:bg-ivory/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Event Info */}
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-charcoal/5 text-stone border border-stone/20">
                          {event.category || 'Event'}
                        </span>
                        {event.clubName && (
                          <span className="text-xs font-medium text-stone">
                            • {event.clubName}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/events/${event.id}`}
                        className="block font-display font-bold text-xl text-ink hover:text-gold transition-colors"
                      >
                        {event.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-charcoal/80 pt-1">
                        <div className="flex items-center gap-1.5">
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
                          <span>{formatEventDate(event.eventDate)}</span>
                        </div>

                        {event.venue && (
                          <div className="flex items-center gap-1.5">
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
                            </svg>
                            <span>{event.venue}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-ink">
                            {event.registeredCount || 0}
                          </span>
                          <span>/</span>
                          <span>{event.capacity || 0} seats</span>
                          {isFull && (
                            <span className="text-[10px] uppercase font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded">
                              Full
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
                      <Link to={`/admin/events/${event.id}/registrants`}>
                        <Button
                          variant="secondary"
                          className="text-xs px-3.5 py-1.5 whitespace-nowrap"
                        >
                          View Registrants ({event.registeredCount || 0})
                        </Button>
                      </Link>

                      <Link to={`/admin/events/${event.id}/edit`}>
                        <Button
                          variant="ghost"
                          className="text-xs px-3 py-1.5 text-stone hover:text-ink border border-stone/20"
                        >
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteEvent(event.id, event.title)}
                        disabled={isDeleting}
                        className="text-xs px-3 py-1.5 text-danger hover:bg-danger/10 border border-danger/20"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
