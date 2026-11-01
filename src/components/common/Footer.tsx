// Footer de l'app.
// Petit kiff perso : le filigrane DEVCONNECT réagit au pointeur en CSS pur (perspective 3D + maskPos).
// Pas besoin de sortir Three.js pour juste un effet de relief lumineux, ça économise du bundle.

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Mail, 
  ChevronDown, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube 
} from 'lucide-react';
import { LegalTab } from '../legal/LegalModal';
import { useApp } from '../../context/AppContext';
import { DevConnectLogo } from '../DevConnectLogo';

export interface SiteFooterProps {
  onNavigate?: (sectionId: string) => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  onOpenLegal
}) => {
  const appContext = useApp();
  const [maskPos, setMaskPos] = useState({ x: 50, y: 50 });
  const [isHoveringWatermark, setIsHoveringWatermark] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  const handleWatermarkMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMaskPos({ x, y });
  };

  const handleNav = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
      return;
    }
    if (appContext) {
      if (sectionId === 'home' || sectionId === 'feed') appContext.setActiveTab('feed');
      else if (sectionId === 'developers' || sectionId === 'matching') appContext.setActiveTab('matching');
      else if (sectionId === 'projects' || sectionId === 'metiers') appContext.setActiveTab('projects');
      else if (sectionId === 'qa') appContext.setActiveTab('qa');
      else if (sectionId === 'chat' || sectionId === 'chat-advisor') appContext.setActiveTab('chat');
      else if (sectionId === 'profile' || sectionId === 'dashboard') {
        if (!appContext.isLoggedIn) {
          appContext.openAuthModal('login');
          return;
        }
        appContext.setActiveTab('profile');
      }
      else if (sectionId === 'team' || sectionId === 'method') appContext.setNvTeamModalOpen(true);
      else if (sectionId === 'faq') appContext.setFaqModalOpen(true);
      else if (sectionId === 'settings') appContext.setSettingsModalOpen(true);
      else if (sectionId === 'ai') appContext.setAiDrawerOpen(true);
      else appContext.setActiveTab('feed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLegal = (tab: LegalTab) => {
    if (onOpenLegal) {
      onOpenLegal(tab);
      return;
    }
    if (appContext) {
      if (tab === 'apdp') appContext.setCookieModalOpen(true);
      else if (tab === 'sitemap') appContext.setSitemapModalOpen(true);
      else if (tab === 'mentions' || tab === 'privacy' || tab === 'cgu') appContext.openLegalModal(tab);
      else appContext.setCookieModalOpen(true);
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-slate-900 dark:bg-[#010103] text-slate-300 dark:text-slate-300 border-t border-slate-200 dark:border-white/[0.08] font-display transition-colors duration-300">
      {/* Halos lumineux d'ambiance */}
      <div className="absolute top-0 left-1/4 w-96 h-40 bg-cyan-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-14 sm:pt-18 lg:pt-22 pb-28 sm:pb-24 lg:pb-12 relative z-10">
        
        {/* Grille responsive : 1 col sur mobile, 2 cols équilibrées sur tablette, 4 cols sur desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-10">
          
          {/* Colonne 1 : Marque & Contact officiel */}
          <div className="space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="inline-flex items-center gap-1 sm:gap-1.5 text-left group focus:outline-none cursor-pointer"
            >
              <DevConnectLogo size={42} animated={true} withTile={false} />
              <span className="font-display font-semibold tracking-tight text-[24px] sm:text-[26px] text-white -ml-0.5 sm:-ml-1">
                ev<span className="text-[#F59E0B]">Connect</span>
              </span>
            </button>
            <p className="text-sm text-slate-300 leading-relaxed">
              La plateforme d'élite pour connecter, recruter et propulser l'excellence des ingénieurs logiciels, développeurs et porteurs de projets tech au Bénin & à l'international.
            </p>
            <div className="pt-2">
              <a
                href="mailto:contact@devconnect.bj"
                className="inline-flex items-center gap-2.5 text-xs text-slate-300 hover:text-cyan-400 font-medium transition-colors group cursor-pointer"
                title="Écrire à contact@devconnect.bj"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/40 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Contact officiel</span>
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">contact@devconnect.bj</span>
                </div>
              </a>
            </div>
          </div>

          {/* Colonne 2 : Services & Plateforme Tech */}
          <div>
            <p className="mb-5 text-[15px] font-semibold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Plateforme & Services</span>
            </p>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => handleNav('feed')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Fil d'actu & Veille Tech</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('matching')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Annuaire des Développeurs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('projects')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Missions réelles en FCFA</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('qa')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Forum Q&A & Entraide</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('chat')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Messagerie & Chat Direct</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('profile')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Espace Profil Certifié</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('settings')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left cursor-pointer w-full group"
                >
                  <span className="flex-1">Paramètres & Confidentialité</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Technologies & Normes (toutes cliquables) */}
          <div>
            <p className="mb-5 text-[15px] font-semibold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Technologies & Normes</span>
            </p>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => handleNav('team')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-left cursor-pointer w-full group"
                >
                  <span className="text-cyan-400 font-mono text-xs group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span className="flex-1">React 19 & TypeScript Strict</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('team')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-left cursor-pointer w-full group"
                >
                  <span className="text-cyan-400 font-mono text-xs group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span className="flex-1">Architecture Microservices & API</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 text-cyan-400 transition-opacity" />
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleLegal('privacy')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-left cursor-pointer w-full group"
                >
                  <span className="text-cyan-400 font-mono text-xs group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span className="flex-1">Chiffrement & Sécurité des données</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegal('mentions')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-left cursor-pointer w-full group"
                >
                  <span className="text-cyan-400 font-mono text-xs group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span className="flex-1">Code du Numérique (Loi 2017-20 Bénin)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('projects')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 text-left cursor-pointer w-full group"
                >
                  <span className="text-cyan-400 font-mono text-xs group-hover:translate-x-0.5 transition-transform">▸</span>
                  <span className="flex-1">Budgets & Devis Transparents en FCFA</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 text-cyan-400 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Écosystème & Ressources */}
          <div>
            <p className="mb-5 text-[15px] font-semibold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>Écosystème & Aide</span>
            </p>
            <ul className="space-y-3 text-[14px]">
              <li>
                <button
                  onClick={() => handleNav('team')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 w-full group"
                >
                  <span className="flex-1">Challenge CADEV 2026 & NV TEAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 w-full group"
                >
                  <span className="flex-1">Foire aux questions (FAQ)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsGuideOpen((prev) => !prev);
                    if (appContext) appContext.setPwaModalOpen(true);
                  }}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 w-full group"
                >
                  <span className="flex-1">Guide d'installation App (PWA)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('ai')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 w-full group"
                >
                  <span className="flex-1">Assistant Technique IA</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegal('sitemap')}
                  className="text-slate-300 hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 w-full group"
                >
                  <span className="flex-1">Plan du site (Sitemap complet)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </li>
              <li>
                <a
                  href="mailto:contact@devconnect.bj?subject=DevConnect%20-%20Partenariat%20Entreprise"
                  className="text-cyan-400 hover:underline font-medium text-left flex items-center gap-1.5 cursor-pointer"
                  title="Contacter l'équipe partenariats à contact@devconnect.bj"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>Contact partenariats entreprises</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Section Newsletter Développeur & Opportunités */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#F59E0B] font-bold">
                  Veille & Opportunités Hebdomadaires
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Restez au cœur de l'écosystème tech béninois
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Recevez chaque semaine les meilleures offres de missions en FCFA, les opportunités remote et les innovations open-source sélectionnées pour les développeurs.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-1 max-w-md">
              {newsletterSuccess ? (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Merci ! Vous êtes bien inscrit(e) à la veille DevConnect.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Votre email professionnel..."
                    required
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 shrink-0 whitespace-nowrap cursor-pointer"
                  >
                    S'abonner
                  </button>
                </div>
              )}
              <p className="text-[11px] text-slate-500 mt-2">
                Strictement confidentiel. Garanti sans spam. Désabonnement en 1 clic.
              </p>
            </form>
          </div>
        </div>

        {/* Accordéon interactif : Guide d'installation Progressive Web App (PWA) */}
        <div className="mt-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-6 transition-all duration-300">
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none"
            aria-expanded={isGuideOpen}
          >
            <div className="flex-1">
              <h3 className="text-base font-bold text-white tracking-tight flex items-start gap-2.5 group-hover:text-cyan-400 transition-colors">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0 mt-1.5" />
                <span className="leading-tight">Installer DevConnect sur tous vos appareils</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 pl-[18px]">
                Profitez d'une expérience fluide en mode application native, même hors-ligne.
              </p>
            </div>
            <div className={`shrink-0 p-2 rounded-full bg-white/[0.03] border border-white/[0.08] transition-transform duration-300 ${isGuideOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden transition-all duration-500 ease-in-out ${isGuideOpen ? 'mt-6 opacity-100 max-h-[700px]' : 'opacity-0 max-h-0'}`}
          >
            {/* Guide iOS */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[11px] font-bold">iPhone / iPad (iOS)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Appuyez sur l'icône <strong className="text-white">Partager</strong> en bas de votre navigateur Safari, puis sélectionnez <strong className="text-cyan-400">"Sur l'écran d'accueil"</strong>.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                Safari &gt; Partager &gt; Sur l'écran d'accueil
              </div>
            </div>

            {/* Guide Android */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">Android (Chrome / Mobile)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Appuyez sur le menu <strong className="text-white">trois points (⋮)</strong> en haut à droite de Chrome, puis appuyez sur <strong className="text-cyan-400">"Installer l'application"</strong> ou "Ajouter à l'écran d'accueil".
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                Menu (⋮) &gt; Installer l'application
              </div>
            </div>

            {/* Guide Desktop / PC */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[11px] font-bold">Ordinateur (PC / Mac)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cliquez sur l'icône <strong className="text-white">d'installation (ordinateur avec flèche)</strong> dans la barre d'adresse de votre navigateur Chrome ou Edge.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                Barre d'adresse &gt; Icône d'installation &gt; Installer
              </div>
            </div>
          </div>
        </div>

        {/* Ligne inférieure : Copyright, Liens Juridiques & Contact / Réseaux */}
        <div className="mt-14 sm:mt-18 flex flex-col items-center justify-center gap-6 border-t border-white/[0.08] pt-8 text-[13px] text-slate-400 text-center">
          
          {/* 1. Copyright centré au milieu */}
          <div className="flex items-center justify-center gap-2 text-slate-400 font-medium text-xs sm:text-[13px] mx-auto">
            <span>© 2026 DevConnect</span>
            <span className="text-slate-500 select-none text-xs">•</span>
            <span>Tous droits réservés</span>
          </div>

          {/* 2. Liens juridiques en 2 colonnes ordonnées (Gauche: CGU -> Cookies -> Mentions | Droite: Sitemap -> Politique -> Sécurité) */}
          <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 max-w-md mx-auto text-left">
            {/* Colonne de gauche */}
            <div className="flex flex-col space-y-2.5">
              <button 
                onClick={() => handleLegal('cgu')} 
                className="text-left hover:text-white transition-colors cursor-pointer text-xs sm:text-[13px]"
              >
                Conditions Générales (CGU)
              </button>
              <button 
                onClick={() => handleLegal('apdp')} 
                className="text-left hover:text-white transition-colors cursor-pointer text-xs sm:text-[13px]"
              >
                Gestion des cookies
              </button>
              <button 
                onClick={() => handleLegal('mentions')} 
                className="text-left hover:text-white transition-colors cursor-pointer text-xs sm:text-[13px]"
              >
                Mentions légales
              </button>
            </div>

            {/* Colonne de droite */}
            <div className="flex flex-col space-y-2.5">
              <button 
                onClick={() => handleLegal('sitemap')} 
                className="text-left hover:text-white transition-colors cursor-pointer text-xs sm:text-[13px]"
              >
                Sitemap
              </button>
              <button 
                onClick={() => handleLegal('privacy')} 
                className="text-left hover:text-white transition-colors cursor-pointer text-xs sm:text-[13px]"
              >
                Politique de confidentialité
              </button>
              <button 
                onClick={() => handleLegal('privacy')} 
                className="text-left hover:text-white transition-colors cursor-pointer text-xs sm:text-[13px] text-cyan-400 hover:text-cyan-300"
              >
                Sécurité & APDP Bénin
              </button>
            </div>
          </div>

          {/* 3. Boutons réseaux sociaux centrés au milieu */}
          <ul className="flex items-center justify-center gap-4 sm:gap-5 mx-auto">
            <li>
              <a
                href="mailto:contact@devconnect.bj"
                aria-label="Email officiel DevConnect"
                title="Écrire à contact@devconnect.bj"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Mail className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Github className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="block text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>

        {/* Watermark géant interactif avec faisceau lumineux au survol de la souris (desktop uniquement) */}
        <div 
          className="mt-14 sm:mt-20 select-none relative w-full overflow-hidden py-6 sm:py-10 md:cursor-crosshair cursor-default group flex flex-col items-center justify-center"
          onMouseMove={(e) => {
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              handleWatermarkMouseMove(e);
            }
          }}
          onMouseEnter={() => {
            if (typeof window !== 'undefined' && window.innerWidth >= 768) {
              setIsHoveringWatermark(true);
            }
          }}
          onMouseLeave={() => setIsHoveringWatermark(false)}
          onTouchStart={() => setIsHoveringWatermark(false)}
        >
          {/* Calque de base discret */}
          <div 
            className="w-full text-center font-black text-[clamp(2.5rem,12vw,10.5rem)] leading-none tracking-tighter text-transparent bg-clip-text dark:bg-gradient-to-b dark:from-white/15 dark:via-white/5 dark:to-transparent bg-gradient-to-b from-slate-900/20 via-slate-900/5 to-transparent uppercase font-display select-none transition-all duration-300"
            style={{
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.12)',
            }}
          >
            DEVCONNECT
          </div>

          {/* Calque lumineux dynamique (masque radial lié à la position de la souris) */}
          <div 
            className="hidden md:flex absolute inset-0 items-center justify-center text-center font-black text-[clamp(2.5rem,12vw,10.5rem)] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 uppercase font-display select-none pointer-events-none transition-opacity duration-500 ease-out"
            style={{
              opacity: isHoveringWatermark ? 1 : 0,
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
              WebkitMaskImage: `radial-gradient(circle 360px at ${maskPos.x}% ${maskPos.y}%, black 0%, black 35%, transparent 75%)`,
              maskImage: `radial-gradient(circle 360px at ${maskPos.x}% ${maskPos.y}%, black 0%, black 35%, transparent 75%)`,
              filter: 'drop-shadow(0 0 35px rgba(56, 189, 248, 0.6))'
            }}
          >
            DEVCONNECT
          </div>

          {/* Sous-titre de la marque sous le watermark */}
          <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-widest uppercase font-mono text-slate-400/80 whitespace-nowrap">
            <span className="w-6 sm:w-8 h-[1px] bg-cyan-400/30" />
            <span>Plateforme Numérique Internationale</span>
            <span className="w-6 sm:w-8 h-[1px] bg-cyan-400/30" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export const Footer = SiteFooter;
export default SiteFooter;
