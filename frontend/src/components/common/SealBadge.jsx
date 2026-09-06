export default function SealBadge({
  status = 'open',
  size = 'md',
  className = '',
  ...props
}) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const statusMap = {
    open: 'text-gold',
    full: 'text-stone opacity-60',
    closed: 'text-stone opacity-60',
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const statusClass = statusMap[status] || statusMap.open;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 transition-all duration-200 ${sizeClass} ${statusClass} ${className}`.trim()}
      role="img"
      aria-label={`Seal badge: ${status}`}
      {...props}
    >
      {/* Subtle outer decorative dashed ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        opacity="0.65"
      />

      {/* Subtle solid middle ring */}
      <circle
        cx="24"
        cy="24"
        r="19"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.4"
      />

      {/* Filled circle background */}
      <circle cx="24" cy="24" r="16.5" fill="currentColor" />

      {/* Decorative seal emblem in center (8-point faceted star insignia) */}
      <g>
        {/* Primary cardinal points */}
        <path
          d="M24 13.5L25.8 20.2L32.5 22L25.8 23.8L24 30.5L22.2 23.8L15.5 22L22.2 20.2Z"
          fill="#0B0B0C"
        />
        {/* Secondary diagonal points */}
        <path
          d="M24 16L25.5 20.5L30 22L25.5 23.5L24 28L22.5 23.5L18 22L22.5 20.5Z"
          fill="#0B0B0C"
          opacity="0.8"
          transform="rotate(45 24 24)"
        />
        {/* Inner center core */}
        <circle cx="24" cy="24" r="2.2" fill="currentColor" />
      </g>
    </svg>
  );
}
