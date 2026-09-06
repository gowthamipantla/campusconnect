import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyRegistrations } from '../services/eventService';
import RegistrationCard from '../components/dashboard/RegistrationCard';
import SealBadge from '../components/common/SealBadge';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchRegistrations = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const data = await getMyRegistrations();
        if (isMounted) {
          setRegistrations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching registrations:', err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            (typeof err.response?.data === 'string' ? err.response?.data : null) ||
            'Unable to load your event registrations.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchRegistrations();
    }

    return () => {
      isMounted = false;
    };
  }, [user, refreshTrigger]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-ivory flex items-center justify-center py-20">
        <Loader message="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN' || user.role === 'CLUB_COORDINATOR') {
    return <Navigate to="/admin" replace />;
  }

  const attendedCount = registrations.filter((r) => r.attended).length;
  const certificatesCount = registrations.filter((r) => r.certificateUrl).length;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Welcome & Profile Header Section */}
        <section className="bg-white border border-stone/20 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone/20 pb-6">
            <div className="flex items-center gap-4">
              <SealBadge status="open" size="lg" />
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                  Welcome, {user.name}!
                </h1>
                <p className="text-stone text-sm mt-0.5">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30">
                {user.role || 'STUDENT'}
              </span>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-danger text-sm hover:underline"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Account Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-ivory/80 rounded-xl border border-stone/15">
              <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
                Total Registrations
              </span>
              <p className="font-display text-2xl font-bold text-ink mt-1">
                {registrations.length}
              </p>
            </div>
            <div className="p-4 bg-ivory/80 rounded-xl border border-stone/15">
              <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
                Events Attended
              </span>
              <p className="font-display text-2xl font-bold text-success mt-1">
                {attendedCount}
              </p>
            </div>
            <div className="p-4 bg-ivory/80 rounded-xl border border-stone/15">
              <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
                Verified Certificates
              </span>
              <p className="font-display text-2xl font-bold text-gold mt-1">
                {certificatesCount}
              </p>
            </div>
          </div>
        </section>

        {/* My Registrations Section */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                My Registrations
              </h2>
              <p className="text-stone text-sm mt-1">
                View your registered events, attendance status, and download participation certificates.
              </p>
            </div>
            <Link to="/events">
              <Button variant="secondary" className="text-sm">
                Browse More Events
              </Button>
            </Link>
          </div>

          {/* Content: Loader, Error, Empty State, or Grid */}
          {loading ? (
            <Loader message="Loading your event registrations..." />
          ) : error ? (
            <div className="bg-white/70 border border-danger/20 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4">
              <p className="text-danger font-medium text-sm">{error}</p>
              <Button
                variant="secondary"
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
              >
                Try Again
              </Button>
            </div>
          ) : registrations.length === 0 ? (
            <div className="bg-white/60 border border-stone/20 rounded-2xl p-6 sm:p-10 shadow-xs">
              <EmptyState
                title="No Registrations Yet"
                message="You haven't registered for any campus events yet. Explore upcoming workshops and activities to get started!"
                action={
                  <Link to="/events">
                    <Button variant="primary">Explore Events</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registrations.map((reg) => (
                <RegistrationCard key={reg.id} registration={reg} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
