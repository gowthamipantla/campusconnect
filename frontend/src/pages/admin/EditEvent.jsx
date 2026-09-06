import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEventById } from '../../services/eventService';
import adminService from '../../services/adminService';
import EventForm from '../../components/admin/EventForm';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

export default function EditEvent() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchEventData = async () => {
      if (!id) return;
      setLoading(true);
      setFetchError('');
      try {
        const data = await getEventById(id);
        if (isMounted) {
          setEvent(data);
        }
      } catch (err) {
        console.error('Error fetching event to edit:', err);
        if (isMounted) {
          setFetchError(
            err.response?.data?.message ||
            (typeof err.response?.data === 'string' ? err.response?.data : null) ||
            'Could not load the requested event.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user && (user.role === 'ADMIN' || user.role === 'CLUB_COORDINATOR')) {
      fetchEventData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, user]);

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

  const handleUpdate = async (formData) => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await adminService.updateEvent(id, formData);
      navigate('/admin');
    } catch (err) {
      console.error('Error updating event:', err);
      setSubmitError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Failed to update event. Please review your modifications.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Back Link & Header */}
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
            Edit Event
          </h1>
          <p className="text-stone text-sm">
            Modify event schedules, venues, attendee capacities, or descriptive details.
          </p>
        </div>

        {/* Global Error Banner */}
        {submitError && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
            {submitError}
          </div>
        )}

        {loading ? (
          <Loader message="Loading event details..." />
        ) : fetchError ? (
          <div className="bg-white/70 border border-danger/20 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4">
            <p className="text-danger font-medium text-sm">{fetchError}</p>
            <Link to="/admin">
              <Button variant="secondary">Return to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <EventForm
            initialValues={event}
            onSubmit={handleUpdate}
            submitLabel="Update Event"
            isSubmitting={isSubmitting}
            onCancel={() => navigate('/admin')}
          />
        )}
      </div>
    </div>
  );
}
