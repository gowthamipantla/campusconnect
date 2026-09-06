import { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import EventCard from '../components/events/EventCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Workshop', 'Seminar'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await eventService.getAllEvents();
        if (isMounted) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            (typeof err.response?.data === 'string' ? err.response?.data : null) ||
            'Unable to load events from the server.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const filteredEvents = events.filter((event) => {
    if (selectedCategory === 'All') return true;
    return (
      event.category &&
      event.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  return (
    <div className="min-h-[calc(100vh-72px)] bg-ivory text-ink font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header Section */}
        <div className="max-w-3xl mb-8 sm:mb-10 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-stone">
            Campus Calendar & Activities
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80">
            Explore and register for upcoming club workshops, cultural festivals, tech
            talks, and academic conferences happening across campus.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-8 mb-8 border-b border-stone/20">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gold text-ink shadow-sm'
                    : 'bg-white/80 text-charcoal border border-stone/20 hover:border-gold hover:text-ink'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        {loading ? (
          <Loader message="Loading upcoming campus events..." />
        ) : error ? (
          <div className="bg-white/60 border border-danger/20 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4">
            <p className="text-danger font-medium text-sm">{error}</p>
            <Button
              variant="secondary"
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
            >
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No Events Found"
            message={
              selectedCategory === 'All'
                ? 'There are currently no events listed. Check back soon!'
                : `No events found in the "${selectedCategory}" category.`
            }
            action={
              selectedCategory !== 'All' ? (
                <Button
                  variant="secondary"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Categories
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
