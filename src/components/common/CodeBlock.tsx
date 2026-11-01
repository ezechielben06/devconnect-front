import React, { useState, useMemo } from 'react';
// Bloc de code readonly avec barre macOS, onglet et coloration VS Code Dark+.
import { Check, Copy, FileCode } from 'lucide-react';
import { highlightSourceCode } from '../../utils/codeHighlighter';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Le navigateur refuse l'accès au presse-papier sans focus utilisateur direct */
    }
  };

  const highlightedHtml = useMemo(() => {
    return highlightSourceCode(code, language);
  }, [code, language]);

  const lines = useMemo(() => {
    return (code || '').split('\n');
  }, [code]);

  return (
    <div
      className={`rounded-2xl border border-[#333333] bg-[#1E1E1E] text-[#D4D4D4] overflow-hidden max-w-full my-2.5 shadow-xl vscode-theme select-none ${className}`}
    >
      {/* Barre d'en-tête de code VS Code */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-xs text-slate-300">
        <div className="flex items-center gap-2 font-mono text-[11px] truncate min-w-0 pr-2">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1E1E1E] border-t-2 border-t-[#007ACC] text-slate-200">
            <FileCode className="w-3.5 h-3.5 text-[#569CD6] shrink-0" aria-hidden="true" />
            <span className="truncate">{filename || `${language}`}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Code copié dans le presse-papiers' : 'Copier le code'}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#333333] cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-400 font-medium">Copié</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Contenu de code avec coloration syntaxique Prism & numéros de ligne */}
      <div className="flex overflow-x-auto max-w-full no-scrollbar">
        {/* Numéros de ligne */}
        <div className="py-3 pl-3 pr-2 select-none text-right text-[#858585] text-[11px] leading-5 font-mono opacity-60 border-r border-[#333333]/40 shrink-0">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code coloré */}
        <div className="p-3 overflow-x-auto flex-1 no-scrollbar">
          <pre className="font-mono text-[11px] sm:text-xs leading-5 whitespace-pre m-0">
            <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
