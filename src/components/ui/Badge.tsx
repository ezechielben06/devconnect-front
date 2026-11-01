import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
    default:
      'bg-blue-50 text-[#0066FF] border-blue-200 font-semibold dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/50',
    success:
      'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50',
    warning:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50',
    info:
      'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/50',
    outline:
      'bg-transparent text-slate-700 border-slate-300 dark:border-slate-700 dark:text-slate-400',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors border ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
