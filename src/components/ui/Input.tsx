import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={`w-full h-10 rounded-xl text-sm transition-colors duration-150 outline-none
              bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-[#0066FF]
              dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500
              border ${
                error
                  ? 'border-rose-500 focus:border-rose-500 dark:border-rose-500'
                  : ''
              }
              ${iconLeft ? 'pl-9' : 'pl-3.5'}
              ${iconRight ? 'pr-9' : 'pr-3.5'}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
