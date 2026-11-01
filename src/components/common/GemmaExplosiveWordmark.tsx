import React from 'react';

export function GemmaExplosiveWordmark({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-300 shadow-sm ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />
      <span className="font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">
        DevConnect Bénin Engine
      </span>
      <span className="text-slate-400" aria-hidden="true">
        &middot;
      </span>
      <span className="text-[11px] text-slate-500 dark:text-slate-400">High-Fidelity Workspace</span>
    </div>
  );
}
