import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      className = '',
      id,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs tabular-nums text-slate-500">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId || helperId}
          className={`w-full rounded-xl text-sm transition-colors duration-150 p-3 outline-none resize-y
            bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-[#0066FF]
            dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500
            border ${
              error
                ? 'border-rose-500 focus:border-rose-500 dark:border-rose-500'
                : ''
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
