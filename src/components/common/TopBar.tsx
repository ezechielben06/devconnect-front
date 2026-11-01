// Barre de navigation principale (desktop en haut, bottom bar sur mobile).
// Capsule verre liquide avec backdrop-blur pour laisser transparaître le canvas WebGL.
// Note: faire gaffe au rubber-banding iOS et au safe-area sur iPhone avec encoche.

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { DevConnectLogo } from '../DevConnectLogo';
import { ActiveTab } from '../../types';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import {
  Flame,
  Users,
  Briefcase,
  HelpCircle,
  MessageSquare,
  User,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  UserPlus,
  Search,
  Menu,
  X,
  ChevronRight,
  Settings,
} from 'lucide-react';

export function TopBar() {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    tabBadges,
    setAiDrawerOpen,
    isLoggedIn,
    logout,
    openAuthModal,
    currentUser,
    setSearchModalOpen,
    setSettingsModalOpen,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu mobile en cliquant en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Mémorise et verrouille le défilement de l'arrière-plan avec effet backblur quand le menu est ouvert
  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    localStorage.setItem('devconnect_mobile_blur_active', mobileMenuOpen ? 'true' : 'false');
  }, [mobileMenuOpen]);

  const tabs: {
    id: ActiveTab;
    labelFr: string;
    labelEn: string;
    shortFr: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'feed', labelFr: "Fil d'actu", labelEn: 'Feed', shortFr: 'Actu', icon: <Flame className="w-4 h-4" /> },
    { id: 'matching', labelFr: 'Développeurs', labelEn: 'Network', shortFr: 'Devs', icon: <Users className="w-4 h-4" /> },
    { id: 'projects', labelFr: 'Missions FCFA', labelEn: 'Projects', shortFr: 'Missions', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'qa', labelFr: 'Q&A Tech', labelEn: 'Q&A', shortFr: 'Q&A', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'chat', labelFr: 'Chat Direct', labelEn: 'Chat', shortFr: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profile', labelFr: 'Mon Profil', labelEn: 'Profile', shortFr: 'Profil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 w-full px-2 sm:px-4 transition-all duration-300">
        <div className="w-full min-w-0 max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1520px] mx-auto glass-ios-nav rounded-full px-3 sm:px-4 lg:px-5 xl:px-6 h-14 sm:h-16 lg:h-18 flex items-center justify-between gap-1.5 sm:gap-2.5 transition-all shadow-[0_12px_36px_-10px_rgba(0,102,255,0.14)]">
          
          {/* Zone 1 : Logo DevConnect officiel (Le D en carreaux jaunes remplace le D noir) */}
          <div className="flex items-center shrink-0 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className="flex items-center gap-0.5 sm:gap-1 cursor-pointer focus:outline-none group select-none shrink-0"
              aria-label="DevConnect - Fil d'actualité accueil"
            >
              <DevConnectLogo size={34} animated={true} withTile={false} />
              <div className="flex items-baseline tracking-tight font-black -ml-0.5 sm:-ml-1">
                <span className="text-base sm:text-lg text-slate-900 dark:text-white transition-colors duration-200 font-extrabold">
                  ev
                </span>
                <span className="text-base sm:text-lg text-[#F59E0B] font-black ml-0.5">
                  Connect
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2 : Navigation principale adaptative (réservée aux membres connectés) */}
          {isLoggedIn && (
            <nav
              className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-full bg-white/20 dark:bg-slate-900/25 border border-white/40 dark:border-white/10 backdrop-blur-xl shrink-0 shadow-inner"
              aria-label="Navigation principale"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const label = language === 'fr' ? tab.labelFr : tab.labelEn;
                const shortLabel = language === 'fr' ? tab.shortFr : tab.labelEn;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (tab.id === 'profile' && !isLoggedIn) {
                        openAuthModal('login');
                        return;
                      }
                      setActiveTab(tab.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    title={label}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white/95 text-[#0066FF] shadow-sm border border-blue-200/80 dark:bg-slate-800/90 dark:text-cyan-400 dark:border-slate-700/60'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-white/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="shrink-0 flex items-center justify-center">
                      {tab.icon}
                    </span>
                    <span className="hidden 2xl:inline text-xs font-bold">{label}</span>
                    <span className="inline 2xl:hidden text-xs font-bold">{shortLabel}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3 : Outils, Recherche & Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
            {/* Bouton de Recherche Globale Instantanée (Cmd+K) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/45 dark:bg-slate-800/25 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10 transition-all cursor-pointer shadow-xs shrink-0 backdrop-blur-md"
              title="Rechercher développeurs, missions FCFA, Q&A (Raccourci ⌘K ou Ctrl+K)"
              aria-label="Rechercher"
            >
              <Search className="w-3.5 h-3.5 text-[#0066FF] dark:text-cyan-400 shrink-0" />
              <span className="hidden 2xl:inline text-xs font-medium">Rechercher</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900 text-[10px] font-mono text-slate-500 font-bold border border-slate-200/80 dark:border-slate-800">
                ⌘K
              </kbd>
            </button>

            {/* Bascule Thème Sombre / Clair (Mobile & Tablette compact) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className="flex xl:hidden p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-white/50 dark:border-white/10 shrink-0"
              aria-label="Basculer le thème"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
              )}
            </button>

            {/* Utilisateur connecté ou boutons Connexion/S'inscrire */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Chip Utilisateur (Desktop >= lg) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="hidden lg:flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 hover:bg-white/70 transition-all cursor-pointer shrink-0 backdrop-blur-md"
                  title="Consulter mon profil"
                >
                  <img
                    src={currentUser.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-[#0066FF] shrink-0"
                  />
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[80px] xl:max-w-[120px]">
                    {formatNameWithUpperLastName(currentUser.name)}
                  </span>
                </button>
                {/* Bouton Déconnexion (flèche de déconnexion uniquement) */}
                <button
                  type="button"
                  onClick={logout}
                  title="Se déconnecter de DevConnect"
                  aria-label="Se déconnecter"
                  className="flex items-center justify-center p-2 rounded-full text-rose-600 dark:text-rose-400 bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-900/40 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0066FF] text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>S'inscrire</span>
                </button>
              </div>
            )}

            {/* Pilule d'outils unifiée (Desktop large >= xl) */}
            <div className="hidden xl:flex items-center gap-0.5 p-0.5 rounded-full bg-white/25 dark:bg-slate-900/35 border border-white/40 dark:border-white/10 shrink-0 backdrop-blur-md">
              {/* Assistant IA */}
              <button
                type="button"
                onClick={() => setAiDrawerOpen(true)}
                aria-label="Ouvrir l'assistant IA DevConnect"
                title="Assistant IA Technique"
                className="p-1.5 rounded-full text-slate-600 hover:text-[#0066FF] hover:bg-white dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {/* Bascule Langue FR / EN */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                aria-label={`Changer de langue vers l'${language === 'fr' ? 'anglais' : 'français'}`}
                title={`Langue active : ${language.toUpperCase()}`}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language.toUpperCase()}
              </button>

              {/* Bascule Thème Sombre / Clair */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                title={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
                className="p-1.5 rounded-full text-slate-600 hover:text-[#0066FF] hover:bg-white dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#0066FF]" aria-hidden="true" />
                )}
              </button>

              {/* Paramètres & Confidentialité */}
              <button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                aria-label="Paramètres et confidentialité"
                title="Paramètres & Confidentialité"
                className="p-1.5 rounded-full text-slate-600 hover:text-[#0066FF] hover:bg-white dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Bouton Menu Mobile & Tablette Déclencheur (< lg) aux bords bien arrondis */}
            <div className="flex lg:hidden items-center gap-1.5 shrink-0">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-white/30 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-800/70 transition-all cursor-pointer backdrop-blur-md shadow-xs"
                  aria-label="Menu du profil"
                >
                  <img
                    src={currentUser.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#0066FF]"
                  />
                  <Menu className="w-4 h-4 text-slate-700 dark:text-slate-300 pr-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-full bg-white/30 dark:bg-slate-800/40 border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200 cursor-pointer backdrop-blur-md shadow-xs"
                  aria-label="Menu des options"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Déroulant Mobile & Tablette avec fluide animation Framer Motion et Backblur mémorisé */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Arrière-plan flouté d'ambiance plein écran (Backblur Android / Tablette) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                ref={mobileMenuRef}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-50 lg:hidden mt-2.5 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md md:max-w-[450px] ml-auto rounded-3xl glass-ios-nav p-4 sm:p-5 md:p-6 shadow-2xl border border-slate-200/90 dark:border-slate-800/90 space-y-3.5 sm:space-y-4.5 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain"
              >
                {/* Profil utilisateur mobile */}
                {isLoggedIn ? (
                  <div className="pb-3 sm:pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-3.5">
                        <img
                          src={currentUser.avatar}
                          alt=""
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=400&q=80';
                          }}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-2xl object-cover ring-2 ring-[#0066FF]"
                        />
                        <div>
                          <p className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight">
                            {formatNameWithUpperLastName(currentUser.name)}
                          </p>
                          <p className="text-[11px] sm:text-xs font-semibold text-[#0066FF] dark:text-cyan-400 mt-0.5">
                            {currentUser.title || currentUser.role}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('profile');
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 sm:p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0066FF] dark:text-cyan-400 text-xs sm:text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Voir profil"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal('login');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-[15px] font-bold text-center bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200/80 transition-colors cursor-pointer"
                    >
                      Connexion
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openAuthModal('register');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-[15px] font-bold text-center bg-[#0066FF] text-white shadow-md shadow-blue-500/25 hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                      <span>S'inscrire</span>
                    </button>
                  </div>
                )}

                {/* Actions rapides & Préférences mobiles équilibrées */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm md:text-[14px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAiDrawerOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200/70 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066FF] dark:text-cyan-400 shrink-0" />
                    <span>Assistant IA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200/70 transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066FF] dark:text-cyan-400 shrink-0" />
                    <span>Paramètres</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                    className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200/70 transition-all cursor-pointer"
                  >
                    <span className="w-4 sm:w-5 text-center font-mono font-black text-xs sm:text-sm text-[#0066FF] shrink-0">
                      {language.toUpperCase()}
                    </span>
                    <span>{language === 'fr' ? 'Français' : 'English'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold hover:bg-slate-200/70 transition-all cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                    ) : (
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066FF] shrink-0" />
                    )}
                    <span>{theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>
                  </button>
                </div>

                {/* Déconnexion Mobile & Tablette */}
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm cursor-pointer hover:bg-rose-100 transition-all"
                  >
                    <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    <span>Se déconnecter</span>
                  </button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Barre de navigation mobile & tablette inférieure style Vitre Liquide (réservée aux membres connectés) */}
      {isLoggedIn && (
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass-ios-bottom-nav px-1.5 sm:px-6 pt-1.5 sm:pt-2 pb-safe shadow-[0_-10px_35px_-5px_rgba(0,0,0,0.15)]"
          style={{ transform: 'translate3d(0, 0, 0)', WebkitTransform: 'translate3d(0, 0, 0)' }}
          aria-label="Navigation mobile et tablette native"
        >
          <div className="grid grid-cols-6 gap-0.5 sm:gap-2 max-w-md sm:max-w-xl mx-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const label = language === 'fr' ? tab.shortFr : tab.labelEn;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'profile' && !isLoggedIn) {
                      openAuthModal('login');
                      return;
                    }
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center py-1 sm:py-2 px-0.5 sm:px-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer min-w-0 ${
                    isActive
                      ? 'text-[#0066FF] dark:text-cyan-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div
                    className={`p-1 sm:p-1.5 rounded-xl sm:rounded-2xl transition-all [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 ${
                      isActive
                        ? 'bg-blue-600/12 dark:bg-cyan-400/20 text-[#0066FF] dark:text-cyan-300 scale-105 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <span
                    className={`text-[9.5px] sm:text-[11px] mt-0.5 leading-none tracking-tight truncate max-w-full text-center ${
                      isActive
                        ? 'font-bold text-[#0066FF] dark:text-cyan-300'
                        : 'font-semibold text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
