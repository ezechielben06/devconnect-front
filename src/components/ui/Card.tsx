import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  featured?: boolean;
}

export function Card({
  children,
  interactive = false,
  featured = false,
  className = '',
  ...props
}: CardProps) {
  const baseClasses =
    'rounded-2xl border transition-all duration-150 p-5 bg-white/95 text-slate-900 shadow-[0_4px_20px_rgba(0,102,255,0.05)] dark:bg-[#090D1A] dark:text-slate-100';
  const borderClasses = featured
    ? 'border-[#0066FF]/50 ring-1 ring-[#0066FF]/20 shadow-md dark:border-cyan-500/40 dark:ring-cyan-500/20 dark:shadow-none'
    : 'border-blue-100/90 dark:border-slate-800/80';
  const interactiveClasses = interactive
    ? 'glass-card-interactive hover:border-[#0066FF]/60 hover:shadow-md dark:hover:border-cyan-500/50 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseClasses} ${borderClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
