// Module Q&A communautaire (entraide dev, bugs d'APIs locales type FedaPay/MTN MoMo, etc.).
// Votes gérés en optimiste pour un feedback immédiat sans temps de latence.

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiContract';
import { QAQuestion } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  ChevronUp,
  Eye,
  Send,
  MessageSquare,
} from 'lucide-react';

export function QAModule() {
  const { language, currentUser } = useApp();
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'resolved' | 'unresolved'>('all');

  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('React 19, TypeScript');

  const [selectedQuestion, setSelectedQuestion] = useState<QAQuestion | null>(null);
  const [answerInput, setAnswerInput] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getQuestions();
      setQuestions(data);
    } catch {
      setError(
        language === 'fr'
          ? 'Impossible de charger les questions techniques pour le moment.'
          : 'Unable to load technical questions at this time.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [language]);

  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags))).slice(0, 8);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'all' || q.tags.includes(selectedTag);

    const matchesMode =
      filterMode === 'all'
        ? true
        : filterMode === 'resolved'
        ? q.isResolved
        : !q.isResolved;

    return matchesSearch && matchesTag && matchesMode;
  });

  const handleVote = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, votes: q.votes + 1 } : q))
    );
    if (selectedQuestion && selectedQuestion.id === questionId) {
      setSelectedQuestion((prev) => (prev ? { ...prev, votes: prev.votes + 1 } : null));
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await apiService.addQuestion({
      title: newTitle.trim(),
      description: newDesc.trim(),
      tags: tagsArray,
      authorId: currentUser.id,
      authorName: formatNameWithUpperLastName(currentUser.name),
      authorAvatar: currentUser.avatar,
    });

    setAskModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    fetchQuestions();
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || !selectedQuestion) return;

    const newAnswer = await apiService.addAnswer(selectedQuestion.id, {
      questionId: selectedQuestion.id,
      authorId: currentUser.id,
      authorName: formatNameWithUpperLastName(currentUser.name),
      authorAvatar: currentUser.avatar,
      content: answerInput.trim(),
    });

    setSelectedQuestion((prev) =>
      prev
        ? {
            ...prev,
            answersCount: prev.answersCount + 1,
            answers: [...prev.answers, newAnswer],
          }
        : null
    );

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestion.id
          ? {
              ...q,
              answersCount: q.answersCount + 1,
              answers: [...q.answers, newAnswer],
            }
          : q
      )
    );

    setAnswerInput('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {language === 'fr' ? 'Échanges & Entraide Technique' : 'Technical Q&A Community'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1128] dark:text-slate-100 tracking-tight">
            {language === 'fr' ? 'Questions & Réponses d\'Ingénierie' : 'Engineering Q&A'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'fr'
              ? 'Résolution collaborative de défis d\'architecture logicielle : React 19, Rust, bases partitionnées, microservices et optimisation de performance.'
              : 'Collaborative problem solving on software architecture, React 19, distributed databases, and performance tuning.'}
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setAskModalOpen(true)}
          className="shrink-0"
        >
          {language === 'fr' ? 'Poser une question' : 'Ask a question'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Input
            placeholder={
              language === 'fr'
                ? 'Rechercher dans les questions techniques ou mots-clés...'
                : 'Search technical discussions or tags...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white text-[#0066FF] font-bold shadow-xs dark:bg-slate-800 dark:text-cyan-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Toutes' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterMode === 'resolved'
                ? 'bg-white text-emerald-700 font-bold shadow-xs dark:bg-slate-800 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Résolues' : 'Resolved'}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('unresolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterMode === 'unresolved'
                ? 'bg-white text-amber-700 font-bold shadow-xs dark:bg-slate-800 dark:text-amber-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'En cours' : 'Open'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedTag('all')}
          className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap border ${
            selectedTag === 'all'
              ? 'bg-blue-50 text-[#0066FF] border-blue-200 font-bold dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60'
              : 'text-slate-600 hover:text-slate-900 border-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800'
          }`}
        >
          {language === 'fr' ? 'Tous les tags' : 'All tags'}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap border ${
              selectedTag === tag
                ? 'bg-blue-50 text-[#0066FF] border-blue-200 font-bold dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 flex gap-4">
              <Skeleton width={48} height={48} className="shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton width="70%" height={20} />
                <Skeleton width="100%" height={32} />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-center space-y-3">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchQuestions}>
            {language === 'fr' ? 'Réessayer' : 'Retry'}
          </Button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-6 h-6" />}
          title={language === 'fr' ? 'Aucune question trouvée' : 'No questions found'}
          description={
            language === 'fr'
              ? 'Aucun sujet ne correspond à vos filtres actuels. Posez votre question technique pour obtenir l\'aide de la communauté.'
              : 'No topics match current filters. Ask your technical question to receive assistance.'
          }
          actionLabel={language === 'fr' ? 'Poser une question' : 'Ask a question'}
          onAction={() => setAskModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => (
            <Card
              key={q.id}
              interactive
              onClick={() => setSelectedQuestion(q)}
              className="p-5 flex flex-col sm:flex-row items-start gap-4 bg-white dark:bg-[#090D1A] border-blue-100/90 dark:border-slate-800 hover:border-[#0066FF]/60 shadow-[0_4px_20px_rgba(0,102,255,0.04)]"
            >
              <button
                type="button"
                onClick={(e) => handleVote(e, q.id)}
                aria-label={`Voter pour cette question (${q.votes} votes actuels)`}
                className="flex sm:flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-[#0066FF]/40 text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer min-w-[52px]"
              >
                <ChevronUp className="w-4 h-4 text-slate-500 hover:text-[#0066FF]" />
                <span className="font-mono text-xs font-bold tabular-nums">
                  {q.votes}
                </span>
              </button>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {q.isResolved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      <span>{language === 'fr' ? 'Résolue' : 'Resolved'}</span>
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-[#0A1128] dark:text-slate-100 hover:text-[#0066FF] dark:hover:text-cyan-400 transition-colors">
                    {q.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {q.description}
                </p>

                <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.map((t) => (
                      <Badge key={t} variant="neutral" size="sm">
                        {t}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {q.authorName}
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <MessageSquare className="w-3 h-3 text-slate-400" aria-hidden="true" />
                      <span>{q.answersCount} {language === 'fr' ? 'rép.' : 'ans.'}</span>
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Eye className="w-3 h-3 text-slate-400" aria-hidden="true" />
                      <span>{q.views}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modale pour poser une question */}
      <Modal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        title={language === 'fr' ? 'Poser une question d\'ingénierie' : 'Ask an engineering question'}
        description={
          language === 'fr'
            ? 'Partagez votre problématique technique pour recevoir les retours de la communauté DevConnect.'
            : 'Submit your architectural or technical problem to receive peer answers.'
        }
        maxWidth="lg"
      >
        <form onSubmit={handleAskQuestion} className="space-y-4">
          <Input
            label={language === 'fr' ? 'Titre précis de la question' : 'Question title'}
            placeholder={
              language === 'fr'
                ? 'Ex: Comment structurer des optimisations de cache sous PostgreSQL partitionné ?'
                : 'Ex: How to handle optimistic mutations in React 19?'
            }
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'fr' ? 'Description détaillée & contexte d\'exécution' : 'Context & detailed description'}
            </label>
            <textarea
              rows={5}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Expliquez ce que vous tentez d\'accomplir, les erreurs observées et les solutions déjà testées...'
                  : 'Describe your context, unexpected behavior, and solutions tested...'
              }
              required
              className="w-full p-3 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-[#0066FF] dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500 outline-none"
            />
          </div>
          <Input
            label={language === 'fr' ? 'Mots-clés / Tags techniques (séparés par des virgules)' : 'Tags (comma-separated)'}
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAskModalOpen(false)}
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {language === 'fr' ? 'Publier la question' : 'Publish question'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modale de consultation approfondie & rédaction de réponse */}
      <Modal
        isOpen={Boolean(selectedQuestion)}
        onClose={() => setSelectedQuestion(null)}
        title={selectedQuestion?.title || 'Détails de la question'}
        maxWidth="xl"
      >
        {selectedQuestion && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-bold text-[#0A1128] dark:text-slate-200">
                  {selectedQuestion.authorName}
                </span>
                <span>{selectedQuestion.createdAt}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedQuestion.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedQuestion.tags.map((t) => (
                  <Badge key={t} variant="neutral" size="sm">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                {language === 'fr'
                  ? `Réponses apportées (${selectedQuestion.answers.length})`
                  : `Answers (${selectedQuestion.answers.length})`}
              </h4>
              {selectedQuestion.answers.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 italic">
                  {language === 'fr'
                    ? 'Aucune réponse pour le moment. Soyez le premier à partager votre solution technique.'
                    : 'No answers yet. Be the first to provide a technical solution.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedQuestion.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2.5 ${
                        ans.isAccepted
                          ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={ans.authorAvatar}
                            name={ans.authorName}
                            size="xs"
                          />
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {ans.authorName}
                          </span>
                        </div>
                        {ans.isAccepted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{language === 'fr' ? 'Solution acceptée' : 'Accepted solution'}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {ans.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handlePostAnswer} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'fr' ? 'Votre réponse d\'ingénierie' : 'Your technical answer'}
              </label>
              <textarea
                rows={3}
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder={
                  language === 'fr'
                    ? 'Proposez une solution argumentée, du code ou une recommandation d\'architecture...'
                    : 'Provide a structured solution, code, or architecture recommendation...'
                }
                required
                className="w-full p-3 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-[#0066FF] dark:bg-[#090D1A] dark:text-slate-100 dark:placeholder:text-slate-500 dark:border-slate-800 dark:focus:border-cyan-500 outline-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuestion(null)}
                >
                  {language === 'fr' ? 'Fermer' : 'Close'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  iconRight={<Send className="w-3.5 h-3.5" />}
                >
                  {language === 'fr' ? 'Publier la réponse' : 'Post answer'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
