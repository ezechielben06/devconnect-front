// Root de l'app. On centralise toutes les modales ici au sommet pour éviter l'enfer des z-index imbriqués.
// FIXME: split les gros modules en dynamic imports (React.lazy) si jamais le bundle commence à trop gonfler.

import React, { useState, useEffect } from "react";
import { Bell, UserPlus } from "lucide-react";
import { DevConnectLogo } from "./components/DevConnectLogo";
import { AppProvider, useApp } from "./context/AppContext";
import { useBoot } from "./hooks/useBoot";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
import { BootLoader } from "./components/BootLoader";
import { TopBar } from "./components/common/TopBar";
import { SiteFooter } from "./components/common/Footer";
import { FluidWebGLCanvas } from "./canvas/FluidWebGLCanvas";
import { MathematicalGrain } from "./components/common/MathematicalGrain";

import { SocialFeedModule } from "./components/feed/SocialFeedModule";
import { DeveloperMatchingModule } from "./components/matching/DeveloperMatchingModule";
import { ProjectsModule } from "./components/projects/ProjectsModule";
import { QAModule } from "./components/qa/QAModule";
import { ChatModule } from "./components/chat/ChatModule";
import { UserProfileModule } from "./components/profile/UserProfileModule";

import { AuthModal } from "./components/auth/AuthModal";
import { LegalModal } from "./components/legal/LegalModal";
import { DeveloperDetailModal } from "./components/profile/DeveloperDetailModal";
import { GlobalSearchModal } from "./components/search/GlobalSearchModal";
import { PWAInstallModal } from "./components/common/PWAInstallModal";
import { AIAssistantDrawer } from "./components/ai/AIAssistantDrawer";
import { SettingsModal } from "./components/settings/SettingsModal";
import { SitemapModal } from "./components/sitemap/SitemapModal";
import { NVTeamModal } from "./components/team/NVTeamModal";
import { CookieConsentBanner } from "./components/cookies/CookieConsentBanner";
import { ExperienceFeedbackModal } from "./components/feedback/ExperienceFeedbackModal";
import { FaqModal } from "./components/common/FaqModal";

function MainApp() {
  const {
    activeTab,
    isLoggedIn,
    openAuthModal,
    searchModalOpen,
    setSearchModalOpen,
    settingsModalOpen,
    setSettingsModalOpen,
    nvTeamModalOpen,
    setNvTeamModalOpen,
    cookieModalOpen,
    setCookieModalOpen,
    feedbackModalOpen,
    setFeedbackModalOpen,
    faqModalOpen,
    setFaqModalOpen,
    authModalOpen,
    legalModalOpen,
    inspectDeveloper,
    pwaModalOpen,
    aiDrawerOpen,
    sitemapModalOpen,
    toastNotification,
  } = useApp();

  const isAnyGlobalModalOpen = Boolean(
    searchModalOpen ||
    settingsModalOpen ||
    nvTeamModalOpen ||
    cookieModalOpen ||
    feedbackModalOpen ||
    faqModalOpen ||
    authModalOpen ||
    legalModalOpen ||
    inspectDeveloper ||
    pwaModalOpen ||
    aiDrawerOpen ||
    sitemapModalOpen,
  );

  useBodyScrollLock(isAnyGlobalModalOpen);
  const boot = useBoot();
  const [bootDone, setBootDone] = useState(false);

  // Inscription obligatoire après le chargement du site comme sur les grands réseaux
  useEffect(() => {
    if (bootDone && !isLoggedIn) {
      openAuthModal("register");
    }
  }, [bootDone, isLoggedIn]);

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[var(--bg-canvas,#f0f4f9)] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Boot Loader Animation */}
      {!bootDone && (
        <BootLoader
          progress={boot.progress}
          ready={boot.ready}
          error={boot.error}
          onRetry={boot.retry}
          onDone={() => setBootDone(true)}
        />
      )}

      {/* Toast de notification épuré avec la cloche */}
      {toastNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold shadow-2xl backdrop-blur-xl border border-white/20 dark:border-slate-800 flex items-center gap-2 animate-fadeIn pointer-events-none">
          <Bell className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Atmospheric Canvas & Grain Elements */}
      <FluidWebGLCanvas />
      <MathematicalGrain />

      {/* Navigation TopBar */}
      <TopBar />

      {/* Main Tab Content Container (flouté si non connecté pour exiger l'inscription) */}
      <main
        className={`flex-1 w-full relative z-10 transition-all duration-300 ${!isLoggedIn ? "filter blur-sm select-none pointer-events-none opacity-40" : ""}`}
      >
        {activeTab === "feed" && <SocialFeedModule />}
        {activeTab === "matching" && <DeveloperMatchingModule />}
        {activeTab === "projects" && <ProjectsModule />}
        {activeTab === "qa" && <QAModule />}
        {activeTab === "chat" && <ChatModule />}
        {activeTab === "profile" && <UserProfileModule />}
      </main>

      {/* Mur d'inscription obligatoire pour les visiteurs non connectés */}
      {!isLoggedIn && bootDone && !authModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl text-center space-y-5">
            <div className="flex justify-center">
              <DevConnectLogo size={52} animated={true} withTile={false} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Rejoignez DevConnect
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Créez un compte pour accéder au fil d'actualité, aux missions
                rémunérées en FCFA et à l'annuaire certifié des développeurs.
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Créer un compte gratuitement</span>
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Déjà inscrit ? Se connecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Footer */}
      <SiteFooter />

      {/* Global Application Modals and Drawers */}
      <AuthModal />
      <LegalModal />
      <DeveloperDetailModal />
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      <PWAInstallModal />
      <AIAssistantDrawer />
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
      <SitemapModal />
      <NVTeamModal
        isOpen={nvTeamModalOpen}
        onClose={() => setNvTeamModalOpen(false)}
      />
      <CookieConsentBanner
        forceOpen={cookieModalOpen}
        onClose={() => setCookieModalOpen(false)}
      />
      <ExperienceFeedbackModal
        forceOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
      <FaqModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
