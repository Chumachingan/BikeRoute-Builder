type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  } as const;

  const variantStyles = {
    primary: 'bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 active:scale-95',
    secondary: 'border border-slate-700 bg-slate-900 text-slate-100 font-semibold hover:bg-slate-800 active:scale-95',
    ghost: 'bg-transparent text-emerald-400 hover:bg-slate-800/50 active:scale-95',
    danger: 'bg-red-500 text-white font-semibold hover:bg-red-400 active:scale-95',
  } as const;

  const base = `rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]}`;

  return <button className={`${base} ${className}`} {...props} />;
}
