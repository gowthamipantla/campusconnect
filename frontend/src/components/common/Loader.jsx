export default function Loader({ message = 'Loading events...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-3 border-stone/20 border-t-gold animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-gold rounded-full" />
        </div>
      </div>
      <p className="text-sm font-medium text-stone animate-pulse">{message}</p>
    </div>
  );
}
