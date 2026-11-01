import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MOCK_DEVELOPERS,
  MOCK_PROJECTS,
  MOCK_QA_QUESTIONS,
  MOCK_CHAT_CHANNELS,
  MOCK_FEED_POSTS,
} from '../../services/mockData';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import {
  Search,
  X,
  Users,
  Briefcase,
  HelpCircle,
  MessageSquare,
  Flame,
  ArrowRight,
  Sparkles,
  Hash,
  Star,
  CheckCircle2,
  Code2,
  History,
  Trash2,
} from 'lucide-react';
import { Developer, Project, QAQuestion, ChatChannel, FeedPost } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'developers' | 'projects' | 'code' | 'qa' | 'chat' | 'feed';

const TRENDING_TAGS = [
  'React',
  'TypeScript',
  'Mobile Money',
  'Python',
  'Cotonou',
  'Tailwind',
  'Freelance FCFA',
  'CADEV 2026',
  'Node.js',
  'Docker',
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { setActiveTab, setInspectDeveloper, language } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('devconnect_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      /* Pas grave si le parsing JSON de l'historique de recherche foire */
    }
  }, []);

  const saveSearchToHistory = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      localStorage.setItem('devconnect_recent_searches', JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('devconnect_recent_searches');
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        developers: MOCK_DEVELOPERS.slice(0, 3),
        projects: MOCK_PROJECTS.slice(0, 3),
        codeSnippets: MOCK_FEED_POSTS.filter((p) => p.codeSnippet).slice(0, 2),
        questions: MOCK_QA_QUESTIONS.slice(0, 2),
        channels: MOCK_CHAT_CHANNELS.slice(0, 2),
        posts: MOCK_FEED_POSTS.slice(0, 2),
        totalCount: 12,
        isInitial: true,
      };
    }

    const devs = MOCK_DEVELOPERS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.skills.some((s) => s.toLowerCase().includes(q)) ||
        d.bioFr.toLowerCase().includes(q) ||
        d.bioEn.toLowerCase().includes(q) ||
        String(d.hourlyRate).includes(q)
    );

    const projs = MOCK_PROJECTS.filter(
      (p) =>
        p.titleFr.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.descriptionFr.toLowerCase().includes(q) ||
        p.skillsRequired.some((s) => s.toLowerCase().includes(q)) ||
        p.authorName.toLowerCase().includes(q) ||
        String(p.budgetMax).includes(q)
    );

    const codeSnips = MOCK_FEED_POSTS.filter(
      (fp) =>
        fp.codeSnippet &&
        (fp.codeSnippet.code.toLowerCase().includes(q) ||
          fp.codeSnippet.language.toLowerCase().includes(q) ||
          (fp.codeSnippet.filename && fp.codeSnippet.filename.toLowerCase().includes(q)) ||
          fp.content.toLowerCase().includes(q))
    );

    const qas = MOCK_QA_QUESTIONS.filter(
      (qa) =>
        qa.title.toLowerCase().includes(q) ||
        qa.description.toLowerCase().includes(q) ||
        qa.tags.some((t) => t.toLowerCase().includes(q)) ||
        qa.authorName.toLowerCase().includes(q)
    );

    const chans = MOCK_CHAT_CHANNELS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.descriptionFr.toLowerCase().includes(q)
    );

    const fposts = MOCK_FEED_POSTS.filter(
      (fp) =>
        fp.authorName.toLowerCase().includes(q) ||
        fp.content.toLowerCase().includes(q) ||
        fp.tags.some((t) => t.toLowerCase().includes(q))
    );

    const totalCount =
      devs.length + projs.length + codeSnips.length + qas.length + chans.length + fposts.length;

    return {
      developers: devs,
      projects: projs,
      codeSnippets: codeSnips,
      questions: qas,
      channels: chans,
      posts: fposts,
      totalCount,
      isInitial: false,
    };
  }, [query]);

  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.trim()})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.trim().toLowerCase() ? (
            <mark
              key={i}
              className="bg-cyan-200/90 dark:bg-cyan-950 dark:text-cyan-300 text-slate-900 rounded px-1 py-0.2 font-black"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleSelectDeveloper = (dev: Developer) => {
    saveSearchToHistory(dev.name);
    onClose();
    setActiveTab('matching');
    setInspectDeveloper(dev);
  };

  const handleSelectProject = (proj: Project) => {
    saveSearchToHistory(proj.titleFr);
    onClose();
    setActiveTab('projects');
  };

  const handleSelectQA = (qa: QAQuestion) => {
    saveSearchToHistory(qa.title);
    onClose();
    setActiveTab('qa');
  };

  const handleSelectChannel = (chan: ChatChannel) => {
    saveSearchToHistory(chan.name);
    onClose();
    setActiveTab('chat');
  };

  const handleSelectPost = (post: FeedPost) => {
    saveSearchToHistory(post.authorName);
    onClose();
    setActiveTab('feed');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recherche universelle DevConnect"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white/95 dark:bg-[#0A1024]/95 backdrop-blur-2xl rounded-3xl border border-blue-200/80 dark:border-slate-800 shadow-[0_25px_70px_-15px_rgba(0,102,255,0.4)] overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3 bg-white dark:bg-[#070B19] shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0066FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                saveSearchToHistory(query.trim());
              }
            }}
            placeholder="Rechercher développeurs, compétences, missions FCFA, snippets, Q&A..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {!query && (
          <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60 space-y-2 shrink-0 text-xs">
            {recentSearches.length > 0 && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <History className="w-3 h-3 text-cyan-500" />
                    <span>Récents :</span>
                  </span>
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#0066FF] text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-slate-400 hover:text-rose-500 text-[10px] flex items-center gap-0.5 cursor-pointer shrink-0"
                  title="Effacer l'historique"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Effacer</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Tendances :</span>
              </span>
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-cyan-400 border border-blue-200/70 dark:border-blue-900/50 hover:bg-blue-100 text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0">
          {[
            { id: 'all', label: 'Tout explorer', count: filteredResults.totalCount },
            { id: 'developers', label: 'Développeurs', count: filteredResults.developers.length },
            { id: 'projects', label: 'Missions FCFA', count: filteredResults.projects.length },
            { id: 'code', label: 'Snippets Code', count: filteredResults.codeSnippets.length },
            { id: 'qa', label: 'Q&A Tech', count: filteredResults.questions.length },
            { id: 'chat', label: 'Salons', count: filteredResults.channels.length },
            { id: 'feed', label: 'Publications', count: filteredResults.posts.length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as SearchCategory)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-5">
          {filteredResults.totalCount === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Aucun résultat pour « {query} »
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Essayez des termes comme « React », « MoMo », « Cotonou », « FCFA », « Python » ou cliquez sur une des tendances.
              </p>
            </div>
          ) : (
            <>
              {(activeCategory === 'all' || activeCategory === 'developers') &&
                filteredResults.developers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>Ingénieurs & Développeurs d'élite</span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {filteredResults.developers.length} profil(s)
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {filteredResults.developers.map((dev) => (
                        <div
                          key={dev.id}
                          onClick={() => handleSelectDeveloper(dev)}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={dev.avatar}
                              alt=""
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80';
                              }}
                              className="w-10 h-10 rounded-2xl object-cover ring-1 ring-blue-500/20 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors truncate">
                                  {formatNameWithUpperLastName(dev.name)}
                                </span>
                                {dev.verified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {highlightMatch(dev.title)} &middot; {highlightMatch(dev.location)}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {dev.skills.slice(0, 4).map((skill) => (
                                  <span
                                    key={skill}
                                    className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                                  >
                                    {highlightMatch(skill)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-[#0066FF] dark:text-cyan-400 whitespace-nowrap">
                              {dev.hourlyRate.toLocaleString('fr-FR')} FCFA/h
                            </span>
                            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{dev.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeCategory === 'all' || activeCategory === 'projects') &&
                filteredResults.projects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Missions Réelles en FCFA</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {filteredResults.projects.length} mission(s)
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {filteredResults.projects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => handleSelectProject(proj)}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                              {highlightMatch(language === 'fr' ? proj.titleFr : proj.titleEn)}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {highlightMatch(proj.skillsRequired.join(', '))} &middot; {proj.timeline}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              {proj.budgetMax.toLocaleString('fr-FR')} FCFA
                            </span>
                            <span className="block text-[10px] text-slate-400">Budget max</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeCategory === 'all' || activeCategory === 'code') &&
                filteredResults.codeSnippets.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Extraits de Code & VS Code</span>
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {filteredResults.codeSnippets.length} extrait(s)
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {filteredResults.codeSnippets.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => handleSelectPost(post)}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-cyan-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                                {post.codeSnippet?.language}
                              </span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {post.codeSnippet?.filename || 'Snippet partagé'}
                              </span>
                            </div>
                            <pre className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate mt-1 bg-black/10 dark:bg-black/30 p-1 rounded">
                              {post.codeSnippet?.code.slice(0, 90)}...
                            </pre>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeCategory === 'all' || activeCategory === 'qa') &&
                filteredResults.questions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Questions & Entraide Q&A</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {filteredResults.questions.length} question(s)
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {filteredResults.questions.map((qa) => (
                        <div
                          key={qa.id}
                          onClick={() => handleSelectQA(qa)}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors truncate">
                              {highlightMatch(qa.title)}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              {qa.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right text-[11px] text-slate-400 shrink-0">
                            <span>{qa.answersCount} réponses</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeCategory === 'all' || activeCategory === 'chat') &&
                filteredResults.channels.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Salons de Discussion</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono">
                        {filteredResults.channels.length} salon(s)
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {filteredResults.channels.map((chan) => (
                        <div
                          key={chan.id}
                          onClick={() => handleSelectChannel(chan)}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Hash className="w-4 h-4 text-indigo-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                #{highlightMatch(chan.name)}
                              </span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {highlightMatch(chan.descriptionFr)}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeCategory === 'all' || activeCategory === 'feed') &&
                filteredResults.posts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span>Publications du Fil d'Actualité</span>
                      </div>
                      <span className="text-[10px] text-orange-400 font-mono">
                        {filteredResults.posts.length} publication(s)
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {filteredResults.posts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => handleSelectPost(post)}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-orange-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                              {formatNameWithUpperLastName(post.authorName)} &middot; {post.timestamp}
                            </span>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                              {highlightMatch(post.content)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-slate-100/70 dark:bg-[#070B19] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <span>Recherche universelle &middot; Challenge CADEV 2026</span>
          <span className="hidden sm:inline">Appuyez sur <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Entrée</kbd> pour valider</span>
        </div>
      </div>
    </div>
  );
}
