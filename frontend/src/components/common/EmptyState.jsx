import SealBadge from './SealBadge';

export default function EmptyState({
  title = 'No Events Found',
  message = 'No events found matching your criteria.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      <div className="mb-4">
        <SealBadge status="closed" size="lg" />
      </div>
      <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
      <p className="text-stone text-sm leading-relaxed mb-6">{message}</p>
      {action}
    </div>
  );
}
