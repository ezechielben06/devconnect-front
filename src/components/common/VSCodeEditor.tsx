import React, { useRef, useState, useMemo } from 'react';
// Mini éditeur façon VS Code avec coloration PrismJS en temps réel et numéros de ligne.
// Attention: le textarea transparent doit être rigoureusement aligné au pixel près sur la div de code en dessous.
import {
  highlightSourceCode,
  detectLanguageFromCode,
  SUPPORTED_LANGUAGES,
} from '../../utils/codeHighlighter';
import {
  FileCode,
  Copy,
  Check,
  Terminal,
  ChevronDown,
  Sparkles,
  Trash2,
} from 'lucide-react';

export interface VSCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange?: (langId: string) => void;
  filename?: string;
  onFilenameChange?: (name: string) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
  showLanguageSelector?: boolean;
  showPresets?: boolean;
}

const PRESET_SNIPPETS: Record<string, { lang: string; file: string; code: string }> = {
  html: {
    lang: 'html',
    file: 'index.html',
    code: `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>DevConnect Bénin</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="app-header">
      <h1>Élite des Développeurs Béninois</h1>
      <button class="btn-primary">Rejoindre le Challenge CADEV</button>
    </header>
  </body>
</html>`,
  },
  css: {
    lang: 'css',
    file: 'styles.css',
    code: `@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 102, 255, 0.4); }
  50% { box-shadow: 0 0 35px rgba(0, 102, 255, 0.8); }
}

.devconnect-card {
  display: flex;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 102, 255, 0.3);
  border-radius: 1.5rem;
  padding: 1.5rem;
  animation: pulseGlow 3s infinite;
}`,
  },
  typescript: {
    lang: 'typescript',
    file: 'developer.ts',
    code: `export interface BenineseEngineer {
  readonly id: string;
  fullName: string; // Ex: Josué AFFAGNON
  skills: readonly string[];
  tjmFCFA: number; // Ex: 175 000 FCFA
  isCadev2026Candidate: boolean;
}

export function evaluateCandidate(eng: BenineseEngineer): string {
  const status = eng.isCadev2026Candidate ? 'Élite CADEV' : 'Ingénieur';
  return \`\${eng.fullName} — \${status} (\${eng.tjmFCFA.toLocaleString('fr-FR')} FCFA/j)\`;
}`,
  },
  go: {
    lang: 'go',
    file: 'server.go',
    code: `package main

import (
	"fmt"
	"net/http"
)

// Microservice backend conçu pour le Challenge CADEV 2026
func main() {
	http.HandleFunc("/api/v1/missions", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\\"status\\": \\"success\\", \\"currency\\": \\"FCFA\\", \\"node\\": \\"Cotonou\\"}")
	})
	http.ListenAndServe(":8080", nil)
}`,
  },
  java: {
    lang: 'java',
    file: 'PaymentMoMo.java',
    code: `package bj.devconnect.fintech;

public class PaymentMoMo {
    private final String phoneNumber; // +229 01 00 00 00
    private final long amountFCFA;

    public PaymentMoMo(String phoneNumber, long amountFCFA) {
        this.phoneNumber = phoneNumber;
        this.amountFCFA = amountFCFA;
    }

    public boolean processTransaction() {
        System.out.println("Processing MTN MoMo / Celtiis Cash: " + amountFCFA + " FCFA");
        return true;
    }
}`,
  },
  python: {
    lang: 'python',
    file: 'matching_ai.py',
    code: `from typing import List, Dict

def rank_beninese_developers(developers: List[Dict], skill_query: str) -> List[Dict]:
    """Score et classe les développeurs béninois selon leurs compétences."""
    matched = [d for d in developers if skill_query.lower() in [s.lower() for s in d["skills"]]]
    return sorted(matched, key=lambda x: x.get("rate_fcfa", 0), reverse=True)

if __name__ == "__main__":
    print("Moteur de matching DevConnect prêt.")`,
  },
  sql: {
    lang: 'sql',
    file: 'schema.sql',
    code: `-- Base de données relationnelle DevConnect Bénin (CADEV 2026)
CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL, -- Ex: Josué AFFAGNON
    city VARCHAR(50) DEFAULT 'Cotonou',
    daily_rate_fcfa INTEGER CHECK (daily_rate_fcfa > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

SELECT * FROM developers WHERE city = 'Cotonou' ORDER BY daily_rate_fcfa DESC;`,
  },
};

export function VSCodeEditor({
  value,
  onChange,
  language = 'typescript',
  onLanguageChange,
  filename,
  onFilenameChange,
  placeholder = '// Saisissez votre code HTML, CSS, TypeScript, Java, Go, Python, PHP, etc...',
  minHeight = '140px',
  readOnly = false,
  showLanguageSelector = true,
  showPresets = true,
}: VSCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const currentLang = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.id === language || l.prismGrammar === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const textBefore = textarea.value.substring(0, textarea.selectionStart);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
          updateCursorPosition();
        }
      }, 0);
    }
  };

  const linesCount = useMemo(() => {
    const count = (value || '').split('\n').length;
    return Math.max(count, 1);
  }, [value]);

  const highlightedHtml = useMemo(() => {
    return highlightSourceCode(value, currentLang.id);
  }, [value, currentLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Permissions clipboard bloquées en iframe ou sans interaction directe */
    }
  };

  const handleClear = () => {
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleAutoDetect = () => {
    if (!value.trim() || !onLanguageChange) return;
    const detected = detectLanguageFromCode(value);
    onLanguageChange(detected);
  };

  const handleLoadPreset = (key: string) => {
    const preset = PRESET_SNIPPETS[key];
    if (!preset) return;
    onChange(preset.code);
    if (onLanguageChange) {
      onLanguageChange(preset.lang);
    }
    if (onFilenameChange) {
      onFilenameChange(preset.file);
    }
  };

  const activeFilename = filename || currentLang.defaultFilename;

  return (
    <div className="rounded-2xl border border-[#3E3E42] bg-[#1E1E1E] text-[#D4D4D4] overflow-hidden shadow-2xl text-xs font-mono select-none vscode-theme transition-all">
      {/* 1. Barre d'onglets façon Visual Studio Code */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-[11px] select-none flex-wrap gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E1E1E] text-slate-200 border-t-2 border-t-[#007ACC] border-r border-[#333333] font-medium shadow-sm">
            <FileCode className="w-3.5 h-3.5 text-[#569CD6]" />
            <span className="truncate">{activeFilename}</span>
            {value.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#569CD6] ml-1" title="Modifié" />}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {value.trim().length > 10 && onLanguageChange && (
            <button
              type="button"
              onClick={handleAutoDetect}
              className="px-2 py-0.5 rounded-lg bg-[#2D2D2D] hover:bg-[#383838] text-[#4EC9B0] text-[10px] border border-[#3E3E42] flex items-center gap-1 cursor-pointer transition-colors"
              title="Détecter automatiquement le langage selon le code"
            >
              <Sparkles className="w-3 h-3 text-[#4EC9B0]" />
              <span className="hidden sm:inline">Auto-détecter</span>
            </button>
          )}

          {showLanguageSelector && onLanguageChange && (
            <div className="relative">
              <select
                value={currentLang.id}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="appearance-none bg-[#2D2D2D] hover:bg-[#383838] text-[#9CDCFE] text-[11px] px-2.5 py-1 pr-6 rounded-lg border border-[#3E3E42] focus:outline-none focus:border-[#007ACC] cursor-pointer"
                title="Langage de programmation"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id} className="bg-[#1E1E1E] text-white">
                    {l.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#333333] transition-colors cursor-pointer"
              title="Effacer le code"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
              title="Copier le code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {showPresets && !value && (
        <div className="px-3 py-1.5 bg-[#181818] border-b border-[#2C2C2C] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] text-slate-400">
          <span className="text-slate-500 shrink-0">Exemples rapides :</span>
          {Object.entries({
            html: 'HTML5',
            css: 'CSS3',
            typescript: 'TypeScript',
            go: 'Go',
            java: 'Java',
            python: 'Python',
            sql: 'SQL',
          }).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleLoadPreset(key)}
              className="px-2 py-0.5 rounded-lg bg-[#252526] hover:bg-[#2D2D2D] hover:text-[#569CD6] text-slate-300 border border-[#333333] shrink-0 transition-colors cursor-pointer"
            >
              +{label}
            </button>
          ))}
        </div>
      )}

      <div className="flex relative bg-[#1E1E1E]" style={{ minHeight }}>
        <div
          className="w-10 sm:w-12 py-3 pr-2 text-right text-[#858585] bg-[#1E1E1E] border-r border-[#333333]/50 select-none font-mono text-xs leading-5 shrink-0 opacity-70"
          aria-hidden="true"
        >
          {Array.from({ length: linesCount }).map((_, i) => (
            <div
              key={i}
              className={cursorPos.line === i + 1 ? 'text-[#C6C6C6] font-bold' : ''}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden bg-[#1E1E1E]">
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 m-0 font-mono text-xs leading-5 whitespace-pre overflow-hidden pointer-events-none select-none z-0"
            dangerouslySetInnerHTML={{
              __html: (highlightedHtml || placeholder) + '\n',
            }}
            style={{
              opacity: value ? 1 : 0.35,
              color: value ? undefined : '#6A9955',
              tabSize: 2,
            }}
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            className="absolute inset-0 w-full h-full p-3 m-0 font-mono text-xs leading-5 whitespace-pre bg-transparent text-transparent caret-white resize-none outline-none border-none z-10 selection:bg-[#264F78]/80"
            style={{ minHeight, tabSize: 2 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-1 bg-[#007ACC] text-white text-[10px] font-sans font-medium select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono">
            <Terminal className="w-3 h-3" />
            <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{linesCount} lignes</span>
          <span>{value.length} car.</span>
          <span className="hidden sm:inline">Espaces: 2</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="hidden sm:inline">UTF-8</span>
          <span className="font-bold bg-white/20 px-1.5 py-0.2 rounded-md text-[9px]">{currentLang.name}</span>
          <span className="text-white/80 hidden sm:inline">VS Code Dark+</span>
        </div>
      </div>
    </div>
  );
}
