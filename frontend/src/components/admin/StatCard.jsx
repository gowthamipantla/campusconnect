export default function StatCard({ label, value, accentColor = 'gold' }) {
  const accentClasses = {
    gold: 'text-gold',
    success: 'text-success',
    stone: 'text-stone',
    danger: 'text-danger',
    ink: 'text-ink',
  };

  const colorClass = accentClasses[accentColor] || accentClasses.gold;

  return (
    <div className="p-4 sm:p-5 bg-ivory/80 rounded-xl border border-stone/15 shadow-xs">
      <span className="text-xs text-stone uppercase font-semibold tracking-wider block">
        {label}
      </span>
      <p className={`font-display text-2xl sm:text-3xl font-bold mt-1 ${colorClass}`}>
        {value}
      </p>
    </div>
  );
}
