// Splash screen de transition avec effet cyberpunk sobre et barre de progression.
// J'ai bindé la touche Escape pour que les testeurs puissent skipper l'anim sans râler.
import React, { useEffect, useState } from 'react';
import { DevConnectLogo } from '../DevConnectLogo';
import { Sparkles, Shield, Cpu, ChevronRight } from 'lucide-react';

export interface SplashScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  { progress: 15, text: 'Initialisation du moteur React 19 & Tailwind...' },
  { progress: 40, text: 'Connexion aux passerelles de paiement MoMo & Celtiis...' },
  { progress: 70, text: 'Chiffrement des canaux & groupes de discussion...' },
  { progress: 90, text: 'Synchronisation du réseau de développeurs CADEV 2026...' },
  { progress: 100, text: 'Espace de travail prêt !' },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isColored, setIsColored] = useState(false);
  const [textRevealed, setTextRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    // Écoute de la touche Échap pour passer directement
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);

    // Séquençage visuel : tracé du D d'abord, illumination ambrée à ~1.1s
    const colorTimer = setTimeout(() => {
      setIsColored(true);
    }, 1150);

    const textTimer = setTimeout(() => {
      setTextRevealed(true);
    }, 1350);

    // Progression fluide de la barre
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 350);
          return 100;
        }
        const step = LOADING_STEPS.findIndex((s) => next <= s.progress);
        if (step !== -1) setCurrentStepIndex(step);
        return next;
      });
    }, 105);

    return () => {
      clearTimeout(colorTimer);
      clearTimeout(textTimer);
      clearInterval(progressTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  const currentStep = LOADING_STEPS[currentStepIndex] || LOADING_STEPS[LOADING_STEPS.length - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] text-white p-4 select-none overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* Halos ambiants cosmiques */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${isColored ? 'bg-[#F59E0B]/25 scale-110' : 'bg-[#0066FF]/10 scale-90'}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Grille technique subtile */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-6 px-4">
        {/* Logo animé : 10 carreaux dessinés posément puis colorés */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-3xl blur-2xl scale-110 pointer-events-none transition-all duration-700 ${isColored ? 'bg-[#F59E0B]/30 opacity-100 animate-pulse' : 'opacity-0'}`} />
          <div className="relative p-3 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl">
            <DevConnectLogo size={68} withTile={true} animated={true} stagedIntro={true} />
          </div>
        </div>

        {/* Titre et marque sous douce animation après coloration */}
        <div className={`space-y-1.5 transition-all duration-700 ease-out ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-baseline">
              <span>ev</span>
              <span className="text-[#F59E0B] drop-shadow-[0_2px_12px_rgba(245,158,11,0.55)] ml-0.5">Connect</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Le Réseau Professionnel des Ingénieurs & Développeurs
          </p>
        </div>

        {/* Barre de progression liquide avec pourcentage */}
        <div className={`w-full space-y-2 pt-2 transition-all duration-700 ease-out ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span className="truncate max-w-[200px] text-left">{currentStep.text}</span>
            </span>
            <span className="font-extrabold text-white tabular-nums">{Math.min(100, progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900/90 border border-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0066FF] via-cyan-400 to-[#F59E0B] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,102,255,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Badges de certification */}
        <div className={`flex items-center justify-center gap-2 pt-2 transition-all duration-700 ease-out ${textRevealed ? 'opacity-100' : 'opacity-0'}`}>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-950/70 text-cyan-400 border border-blue-800/50">
            <Shield className="w-3 h-3" />
            <span>CADEV 2026</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-950/70 text-amber-400 border border-amber-800/50">
            <Sparkles className="w-3 h-3" />
            <span>REACT 19 NATIVE</span>
          </span>
        </div>

        {/* Bouton pour passer directement */}
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 transition-all cursor-pointer mt-2"
        >
          <span>Accéder à l'application</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mention de bas de page */}
      <footer className="absolute bottom-4 inset-x-0 text-center text-[10px] text-slate-600 font-mono">
        RÉPUBLIQUE DU BÉNIN • ÉCOSYSTÈME TECH D'ÉLITE
      </footer>
    </div>
  );
}
