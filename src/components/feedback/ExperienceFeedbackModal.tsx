// Modale d'évaluation de l'expérience utilisateur.
// Déclenchée après 5 minutes de navigation active si l'utilisateur n'a pas encore voté.
import React, { useState, useEffect } from 'react';
import { Star, X, Sparkles, CheckCircle2, ThumbsUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface ExperienceFeedbackModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function ExperienceFeedbackModal({ forceOpen, onClose }: ExperienceFeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  useBodyScrollLock(isOpen);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const quickChips = [
    'Design iOS 26 magnifique',
    'Ultra fluide et rapide',
    'Budgets FCFA bien calibrés',
    'Fil d\'actualité interactif',
    'Bravo pour le Challenge CADEV',
  ];

  useEffect(() => {
    const alreadyEvaluated = localStorage.getItem('devconnect_experience_feedback_submitted');
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next === 300 && !alreadyEvaluated) {
          setIsOpen(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setSubmitted(false);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleToggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const feedbackPayload = {
      rating,
      comment: comment.trim(),
      tags: selectedChips,
      submittedAt: new Date().toISOString(),
      sessionSeconds: elapsedSeconds,
    };

    localStorage.setItem('devconnect_experience_feedback_submitted', 'true');
    localStorage.setItem('devconnect_user_experience_feedback', JSON.stringify(feedbackPayload));
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      if (onClose) onClose();
    }, 2200);
  };

  if (!isOpen) return null;

  const currentScore = hoverRating || rating;
  const labels: Record<number, { text: string; color: string }> = {
    1: { text: 'Décevant • Des améliorations nécessaires', color: 'text-rose-500' },
    2: { text: 'Moyen • Peut mieux faire', color: 'text-amber-500' },
    3: { text: 'Bien • Expérience agréable', color: 'text-blue-500' },
    4: { text: 'Très bien • Fluide et moderne', color: 'text-indigo-500' },
    5: { text: 'Exceptionnel ! • Bravo à l\'équipe', color: 'text-emerald-500' },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="relative w-full max-w-lg bg-white/95 dark:bg-[#0B1021]/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_-15px_rgba(0,102,255,0.35)] overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          aria-label="Fermer et continuer"
          title="Fermer et continuer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Merci pour votre précieux avis !
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Vos retours d'expérience sont pris en compte avec le plus grand soin pour l'épreuve finale du <strong>Challenge National CADEV 2026</strong>.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066FF] dark:text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Votre évaluation a été bien mémorisée</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  Votre avis sur DevConnect
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Comment évaluez-vous votre expérience sur la plateforme ?
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentScore;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                      className="p-1 rounded-xl transform transition-transform duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-9 sm:h-9 transition-all duration-300 ease-out ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.45)]'
                            : 'text-slate-300 dark:text-slate-700 fill-transparent hover:text-amber-300/60'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="h-5 text-xs font-bold transition-all duration-200">
                {currentScore > 0 ? (
                  <span className={`${labels[currentScore]?.color} animate-fadeIn`}>
                    {labels[currentScore]?.text}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] font-medium">
                    Sélectionnez une note pour continuer
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Ce qui vous a marqué (optionnel) :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleToggleChip(chip)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Votre avis ou suggestion pour Narcisse (Frontend) & Vertueux (Backend)..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
              >
                Fermer et continuer
              </button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={rating === 0}
                className="w-full sm:w-auto !rounded-xl sm:!rounded-2xl"
                iconRight={<ThumbsUp className="w-4 h-4" />}
              >
                Envoyer mon avis
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
