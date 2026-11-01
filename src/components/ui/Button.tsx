// Bouton polymorphe avec variantes et spinners de loading.
// Important : flex-nowrap et whitespace-nowrap pour éviter que les icônes fléchées passent à la ligne sur mobile !
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2.5',
    }[size];

    const variantClasses = {
      primary:
        'bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-sm active:scale-[0.98] border border-blue-600/30 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:border-cyan-500/30',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200 font-semibold shadow-2xs active:scale-[0.98] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700',
      outline:
        'bg-white hover:bg-blue-50/70 text-[#0066FF] border-slate-300 font-semibold active:scale-[0.98] dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/80',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 active:scale-[0.98] dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm active:scale-[0.98] border border-rose-500/40',
    }[variant];

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex flex-row flex-nowrap items-center justify-center rounded-xl font-medium transition-all duration-150 select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer border ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          iconLeft && <span className="inline-flex items-center justify-center shrink-0">{iconLeft}</span>
        )}
        {children && <span className="inline-flex items-center justify-center gap-1.5 shrink-0 max-w-full truncate">{children}</span>}
        {!loading && iconRight && (
          <span className="inline-flex items-center justify-center shrink-0">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
