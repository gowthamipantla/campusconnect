import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEventById } from '../../services/eventService';
import adminService from '../../services/adminService';
import RegistrantsTable from '../../components/admin/RegistrantsTable';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

export default function EventRegistrants() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [event, setEvent] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    setActionError('');
    try {
      const [eventData, registrantsData] = await Promise.all([
        getEventById(id),
        adminService.getEventRegistrants(id),
      ]);
      setEvent(eventData);
      setRegistrants(Array.isArray(registrantsData) ? registrantsData : []);
    } catch (err) {
      console.error('Error loading event registrants:', err);
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Unable to load registrants for this event.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'CLUB_COORDINATOR')) {
      loadData();
    }
  }, [user, loadData]);

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

  const handleToggleAttendance = async (registrationId, currentAttendedState) => {
    setUpdatingId(registrationId);
    setActionError('');
    try {
      const nextState = !currentAttendedState;
      const updatedRegistration = await adminService.markAttendance(
        registrationId,
        nextState
      );

      // Update local state with the returned registration
      setRegistrants((prev) =>
        prev.map((reg) =>
          reg.id === registrationId
            ? { ...reg, ...updatedRegistration }
            : reg
        )
      );
    } catch (err) {
      console.error('Error updating attendance:', err);
      setActionError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Failed to update attendance status.'
      );
      // Fallback reload if something went out of sync
      await loadData();
    } finally {
      setUpdatingId(null);
    }
  };

  const attendedCount = registrants.filter((r) => r.attended).length;
  const certificatesCount = registrants.filter((r) => r.certificateUrl).length;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone hover:text-ink transition-colors uppercase tracking-wider"
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
              Back to Admin Dashboard
            </Link>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {event?.title ? `${event.title} — Registrants` : 'Event Registrants'}
            </h1>
            <p className="text-stone text-sm">
              Review registered participants and mark verified attendance to issue certificates.
            </p>
          </div>

          {event && (
            <div className="flex items-center gap-3">
              <Link to={`/admin/events/${event.id}/edit`}>
                <Button variant="secondary" className="text-xs px-4 py-2">
                  Edit Event Details
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
            {actionError}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Loader message="Loading registrants list..." />
        ) : error ? (
          <div className="bg-white/70 border border-danger/20 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4">
            <p className="text-danger font-medium text-sm">{error}</p>
            <Button variant="secondary" onClick={loadData}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Summary Pill Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone/15">
                <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
                  Total Registrants
                </span>
                <p className="font-display text-2xl font-bold text-ink mt-1">
                  {registrants.length}
                  {event?.capacity ? (
                    <span className="text-sm font-normal text-stone ml-1.5">
                      / {event.capacity} capacity
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone/15">
                <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
                  Attended Students
                </span>
                <p className="font-display text-2xl font-bold text-success mt-1">
                  {attendedCount}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone/15">
                <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
                  Certificates Issued
                </span>
                <p className="font-display text-2xl font-bold text-gold mt-1">
                  {certificatesCount}
                </p>
              </div>
            </div>

            {/* Registrants Table */}
            <RegistrantsTable
              registrants={registrants}
              onToggleAttendance={handleToggleAttendance}
              updatingId={updatingId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
