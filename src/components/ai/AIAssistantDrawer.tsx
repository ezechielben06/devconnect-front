// Tiroir d'assistance technique pour les devs (revue de code, requêtes SQL et architecture React 19).
// J'ai foutu un piège de focus au clavier (Tab/Shift+Tab) pour que l'accessibilité soit nickel.
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { CodeBlock } from '../common/CodeBlock';
import { X, Sparkles, Send, RefreshCw } from 'lucide-react';

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  codeSnippet?: {
    code: string;
    language: string;
    filename?: string;
  };
}

export function AIAssistantDrawer() {
  const { aiDrawerOpen, setAiDrawerOpen, language, currentUser } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text:
        language === 'fr'
          ? `Bonjour ${currentUser.name}. Je suis l'assistant d'ingénierie technique de DevConnect. Je peux relire votre code, cadrer un besoin technique de mission ou optimiser des requêtes SQL et des composants React 19.`
          : `Hello ${currentUser.name}. I am the DevConnect technical assistant. I can review code, scope technical mission requirements, or optimize SQL queries and React 19 components.`,
    },
  ]);

  useEffect(() => {
    if (!aiDrawerOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setAiDrawerOpen(false);
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [aiDrawerOpen, setAiDrawerOpen]);

  if (!aiDrawerOpen) return null;

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      let replyText = '';
      let snippet: AssistantMessage['codeSnippet'] = undefined;

      if (userText.toLowerCase().includes('react') || userText.toLowerCase().includes('hook')) {
        replyText =
          language === 'fr'
            ? 'Pour gérer des mutations asynchrones avec React 19 sans race condition, préférez useActionState avec une projection optimiste :'
            : 'To handle async mutations in React 19 without race conditions, use useActionState with predictable optimistic state projections:';
        snippet = {
          language: 'typescript',
          filename: 'useOptimisticTask.ts',
          code: `import { useActionState, useOptimistic } from 'react';

export function useOptimisticTaskMutation(initialData: Task[]) {
  const [tasks, setTasks] = useOptimistic(
    initialData,
    (current, update: Task) => [...current, update]
  );
  return { tasks, setTasks };
}`,
        };
      } else {
        replyText =
          language === 'fr'
            ? `Analyse de votre requête : « ${userText} ». Les critères de typage strict, de sécurité et d'accessibilité sont validés avec succès.`
            : `Analysis of your query: "${userText}". Strict typing, security, and accessibility standards are successfully met.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          codeSnippet: snippet,
        },
      ]);
      setLoading(false);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setAiDrawerOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white text-slate-900 border-l border-slate-200 shadow-2xl dark:bg-[#090D1A] dark:text-slate-100 dark:border-slate-800 flex flex-col z-10 animate-fadeIn outline-none"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0066FF] dark:bg-cyan-950/60 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="drawer-title" className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {language === 'fr' ? 'Assistant Technique' : 'Technical Assistant'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'fr' ? 'Conseil d\'architecture & revue de code' : 'Architecture advice & code review'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAiDrawerOpen(false)}
            aria-label="Fermer l'assistant IA"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0066FF] text-white font-medium shadow-sm'
                    : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/80 dark:text-slate-200 dark:border-slate-800/60 border'
                }`}
              >
                <p>{m.text}</p>
                {m.codeSnippet && (
                  <div className="mt-2.5">
                    <CodeBlock
                      code={m.codeSnippet.code}
                      language={m.codeSnippet.language}
                      filename={m.codeSnippet.filename}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#0066FF] dark:text-cyan-400 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              <span>{language === 'fr' ? 'Analyse en cours...' : 'Analyzing...'}</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 shrink-0 bg-slate-50 dark:bg-slate-950/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Posez une question technique ou collez du code...'
                  : 'Ask a technical question or paste code...'
              }
              className="flex-1 h-10 px-3.5 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-[#0066FF] dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500 outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!input.trim() || loading}
              aria-label="Envoyer le message à l'assistant"
              className="rounded-xl px-3"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
