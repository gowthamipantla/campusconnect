import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import EventForm from '../../components/admin/EventForm';
import Loader from '../../components/common/Loader';

export default function CreateEvent() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreate = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      await adminService.createEvent(formData);
      navigate('/admin');
    } catch (err) {
      console.error('Error creating event:', err);
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        'Failed to create event. Please verify the event details.'
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
            Create New Event
          </h1>
          <p className="text-stone text-sm">
            Publish a new campus activity, workshop, or gathering for students to register.
          </p>
        </div>

        {/* Global Error Banner if any */}
        {error && (
          <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        {/* Event Form */}
        <EventForm
          onSubmit={handleCreate}
          submitLabel="Publish Event"
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/admin')}
        />
      </div>
    </div>
  );
}
