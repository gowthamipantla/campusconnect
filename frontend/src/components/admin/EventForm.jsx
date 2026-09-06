import { useState, useEffect } from 'react';
import Button from '../common/Button';

const CATEGORIES = [
  { label: 'Technical', value: 'TECHNICAL' },
  { label: 'Cultural', value: 'CULTURAL' },
  { label: 'Workshop', value: 'WORKSHOP' },
  { label: 'Seminar', value: 'SEMINAR' },
];

export default function EventForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save Event',
  isSubmitting = false,
  onCancel,
}) {
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return typeof dateString === 'string' ? dateString.slice(0, 16) : '';
      }
      const pad = (n) => String(n).padStart(2, '0');
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    category: initialValues.category ? initialValues.category.toUpperCase() : 'TECHNICAL',
    clubName: initialValues.clubName || '',
    eventDate: formatForDateTimeLocal(initialValues.eventDate),
    venue: initialValues.venue || '',
    capacity: initialValues.capacity !== undefined ? String(initialValues.capacity) : '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
        category: initialValues.category ? initialValues.category.toUpperCase() : 'TECHNICAL',
        clubName: initialValues.clubName || '',
        eventDate: formatForDateTimeLocal(initialValues.eventDate),
        venue: initialValues.venue || '',
        capacity: initialValues.capacity !== undefined ? String(initialValues.capacity) : '',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.clubName.trim() ||
      !formData.eventDate ||
      !formData.venue.trim() ||
      formData.capacity === ''
    ) {
      setError('All fields are required. Please fill out every field.');
      return;
    }

    const numCapacity = Number(formData.capacity);
    if (isNaN(numCapacity) || numCapacity <= 0 || !Number.isInteger(numCapacity)) {
      setError('Capacity must be a positive whole number.');
      return;
    }

    // Submit payload
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      clubName: formData.clubName.trim(),
      eventDate: formData.eventDate,
      venue: formData.venue.trim(),
      capacity: numCapacity,
    });
  };

  return (
    <div className="bg-white border border-stone/20 rounded-2xl p-6 sm:p-8 shadow-sm">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
          >
            Event Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. AI & Web3 Summit 2026"
            className="w-full bg-ivory/50 border border-stone/30 text-ink placeholder-stone/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide details about the event, agenda, speakers, and instructions for attendees..."
            className="w-full bg-ivory/50 border border-stone/30 text-ink placeholder-stone/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-y"
          />
        </div>

        {/* Category & Club Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-ivory/50 border border-stone/30 text-ink rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="clubName"
              className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
            >
              Organizing Club / Society *
            </label>
            <input
              id="clubName"
              name="clubName"
              type="text"
              required
              value={formData.clubName}
              onChange={handleChange}
              placeholder="e.g. Computer Science Society"
              className="w-full bg-ivory/50 border border-stone/30 text-ink placeholder-stone/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
        </div>

        {/* Date & Time, Venue, Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="eventDate"
              className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
            >
              Event Date & Time *
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              required
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full bg-ivory/50 border border-stone/30 text-ink rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="venue"
              className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
            >
              Venue / Location *
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              required
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium / Room 402"
              className="w-full bg-ivory/50 border border-stone/30 text-ink placeholder-stone/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5"
            >
              Capacity (Seats) *
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              required
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full bg-ivory/50 border border-stone/30 text-ink placeholder-stone/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-stone/20 flex items-center justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-stone hover:text-ink text-sm px-4 py-2"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold"
          >
            {isSubmitting ? 'Saving Event...' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
