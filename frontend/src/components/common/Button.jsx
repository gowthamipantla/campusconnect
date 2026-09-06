export default function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-body text-sm sm:text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary:
      'bg-gold text-ink hover:bg-gold-bright rounded-md px-6 py-2.5 shadow-sm active:scale-[0.99]',
    secondary:
      'bg-transparent border-2 border-gold text-gold hover:bg-gold/10 rounded-md px-6 py-2.5 active:scale-[0.99]',
    ghost:
      'bg-transparent border-0 text-inherit hover:underline px-4 py-2',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${selectedVariant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
