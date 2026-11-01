// Gestion des cookies & consentement (normes APDP Bénin / RGPD).
// Les essentiels restent verrouillés actifs (session + thème) et impossible à désactiver côté UI.

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, X, Lock, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  updatedAt: string;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  preferences: true,
  analytics: true,
  updatedAt: new Date().toISOString(),
};

export function setCookieValue(name: string, value: string, days: number = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getCookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}

interface CookieConsentBannerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function CookieConsentBanner({ forceOpen, onClose }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);
  useBodyScrollLock(visible);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const rawSaved = localStorage.getItem('devconnect_cookie_preferences') || getCookieValue('devconnect_cookies_consent');
    if (rawSaved) {
      try {
        const parsed = JSON.parse(rawSaved);
        setPrefs(parsed);
      } catch {
        /* Si l'utilisateur ou une extension a corrompu la string JSON, on garde les defaults */
      }
    } else {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (forceOpen) {
      setVisible(true);
      setShowCustomize(true);
    }
  }, [forceOpen]);

  const applyAndSave = (finalPrefs: CookiePreferences) => {
    setPrefs(finalPrefs);
    const json = JSON.stringify(finalPrefs);
    setCookieValue('devconnect_cookies_consent', json, 365);
    setCookieValue('devconnect_cookies_essential', 'true', 365);
    setCookieValue('devconnect_cookies_prefs', String(finalPrefs.preferences), 365);
    setCookieValue('devconnect_cookies_analytics', String(finalPrefs.analytics), 365);
    localStorage.setItem('devconnect_cookie_preferences', json);

    if (!finalPrefs.preferences) {
      deleteCookie('devconnect_chat_wallpaper');
    }

    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setVisible(false);
      if (onClose) onClose();
    }, 1500);
  };

  const handleAcceptAll = () => {
    applyAndSave({
      essential: true,
      preferences: true,
      analytics: true,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRefuseNonEssential = () => {
    applyAndSave({
      essential: true,
      preferences: false,
      analytics: false,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    applyAndSave({
      ...prefs,
      essential: true,
      updatedAt: new Date().toISOString(),
    });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gestion des cookies"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={() => {}}
    >
      <div
        className="relative w-full max-w-xl bg-white/95 dark:bg-[#0A1024]/95 backdrop-blur-2xl border border-blue-200/80 dark:border-slate-800 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,102,255,0.4)] transition-all max-h-[88vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="p-5 sm:p-7 overflow-y-auto no-scrollbar w-full flex-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Gestion des Cookies
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Conformité Loi N° 2017-20 &middot; Challenge CADEV 2026
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                if (onClose) onClose();
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer temporairement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            DevConnect utilise des <strong>cookies réels et fonctionnels</strong> pour sécuriser votre authentification, mémoriser vos préférences (devise 100% FCFA, thèmes) et garantir la fluidité 60 FPS du fil d'actualité.
          </p>

          {showCustomize && (
            <div className="space-y-3 mb-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs animate-fadeIn">
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Cookies strictement nécessaires</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sécurité CSRF, session de connexion sécurisée, détection d'opérateur mobile (MTN/Moov/Celtiis).
                  </p>
                </div>
                <div 
                  className="relative inline-flex items-center shrink-0 cursor-not-allowed opacity-75"
                  title="Activé obligatoirement pour le fonctionnement de la plateforme (indésactivable)"
                  aria-label="Cookies strictement nécessaires activés et non modifiables"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    readOnly
                    className="sr-only peer"
                    aria-disabled="true"
                  />
                  <div className="w-9 h-5 bg-[#0066FF] rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:translate-x-full after:bg-white after:border-white after:border after:rounded-full after:h-4 after:w-4 transition-all" />
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cookies de préférences & affichage</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mémorisation de la devise 100% FCFA, thème clair/sombre, fonds de discussion.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.preferences}
                    onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]" />
                </label>
              </div>

              <div className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cookies de mesure & fluidité</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mesure du temps de réponse 60 FPS et métriques de session.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]" />
                </label>
              </div>
            </div>
          )}

          {savedToast ? (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Vos préférences ont été enregistrées dans les cookies du navigateur.</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setShowCustomize(!showCustomize)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0066FF] cursor-pointer"
              >
                <span>{showCustomize ? 'Masquer le détail' : 'Personnaliser'}</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {showCustomize ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={handleSaveCustom}
                    className="!rounded-xl text-xs font-bold"
                  >
                    Enregistrer mes choix
                  </Button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleRefuseNonEssential}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      Refuser les non-essentiels
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={handleAcceptAll}
                      className="!rounded-xl text-xs font-bold px-4"
                    >
                      Tout accepter
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 pt-3.5 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Conformité Loi N° 2017-20 &middot; Code du Numérique Bénin
            </span>
            <span className="text-[10px] text-slate-400">
              Protection APDP &amp; Données Souveraines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
