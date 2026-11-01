import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveTab, CurrentUserProfile, Developer, Language, Theme } from '../types';
import { CURRENT_USER, avatarKodjo, avatarSena } from '../services/mockData';
import { formatNameWithUpperLastName } from '../utils/formatters';
import { authApi } from '../api';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tabBadges: Record<ActiveTab, number>;
  clearTabBadge: (tab: ActiveTab) => void;
  incrementTabBadge: (tab: ActiveTab, count?: number) => void;
  currentUser: CurrentUserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUserProfile>>;
  updateCurrentUser: (updates: Partial<CurrentUserProfile>) => void;
  isLoggedIn: boolean;
  login: (userData: Partial<CurrentUserProfile>) => void;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  legalModalOpen: boolean;
  setLegalModalOpen: (open: boolean) => void;
  legalModalTab: 'cgu' | 'privacy' | 'mentions';
  setLegalModalTab: (tab: 'cgu' | 'privacy' | 'mentions') => void;
  openLegalModal: (tab?: 'cgu' | 'privacy' | 'mentions') => void;
  inspectDeveloper: Developer | null;
  setInspectDeveloper: (dev: Developer | null) => void;
  sitemapModalOpen: boolean;
  setSitemapModalOpen: (open: boolean) => void;
  pwaModalOpen: boolean;
  setPwaModalOpen: (open: boolean) => void;
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  cookieModalOpen: boolean;
  setCookieModalOpen: (open: boolean) => void;
  feedbackModalOpen: boolean;
  setFeedbackModalOpen: (open: boolean) => void;
  faqModalOpen: boolean;
  setFaqModalOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  nvTeamModalOpen: boolean;
  setNvTeamModalOpen: (open: boolean) => void;
  connectedDevIds: string[];
  pendingSentInvitations: string[];
  pendingReceivedInvitations: {
    id: string;
    devId: string;
    name: string;
    title: string;
    avatar: string;
    location: string;
    mutualCount: number;
    timeAgo: string;
  }[];
  sendInvitation: (devId: string, devName?: string) => void;
  cancelInvitation: (devId: string) => void;
  acceptInvitation: (invitationId: string) => void;
  rejectInvitation: (invitationId: string) => void;
  disconnectDeveloper: (devId: string) => void;
  getConnectionStatus: (devId: string) => 'none' | 'pending' | 'connected';
  toastNotification: string | null;
  triggerToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('devconnect_lang');
      return stored === 'en' ? 'en' : 'fr';
    } catch {
      return 'fr';
    }
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('devconnect_theme');
      return stored === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('feed');
  const [tabBadges, setTabBadges] = useState<Record<ActiveTab, number>>({
    feed: 0,
    matching: 0,
    projects: 2,
    qa: 1,
    chat: 3,
    profile: 0,
  });

  const clearTabBadge = (tab: ActiveTab) => {
    setTabBadges((prev) => ({ ...prev, [tab]: 0 }));
  };

  const incrementTabBadge = (tab: ActiveTab, count: number = 1) => {
    setTabBadges((prev) => ({ ...prev, [tab]: (prev[tab] || 0) + count }));
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    clearTabBadge(tab);
  };

  const [currentUser, setCurrentUser] = useState<CurrentUserProfile>(() => {
    try {
      const stored = localStorage.getItem('devconnect_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        const cleanNV = (txt?: string) => (txt ? txt.replace(/•?\s*NV\s*TEAM\s*/gi, '').replace(/\s{2,}/g, ' ').trim() : '');
        return {
          ...CURRENT_USER,
          ...parsed,
          name: formatNameWithUpperLastName(parsed.name || CURRENT_USER.name),
          role: cleanNV(parsed.role) || CURRENT_USER.role,
          title: cleanNV(parsed.title) || CURRENT_USER.title,
          bioFr: cleanNV(parsed.bioFr) || CURRENT_USER.bioFr,
          bioEn: cleanNV(parsed.bioEn) || CURRENT_USER.bioEn,
        };
      }
    } catch {
      /* Safari en mode privé ou quota localStorage plein, on fallback sur le mock */
    }
    return CURRENT_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('devconnect_auth_session') === 'true';
    } catch {
      return false;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'cgu' | 'privacy' | 'mentions'>('cgu');
  const [inspectDeveloper, setInspectDeveloper] = useState<Developer | null>(null);
  const [sitemapModalOpen, setSitemapModalOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [nvTeamModalOpen, setNvTeamModalOpen] = useState(false);

  const [connectedDevIds, setConnectedDevIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('devconnect_connected_devs');
      return stored ? JSON.parse(stored) : ['dev-vertueux', 'dev-fifame'];
    } catch {
      return ['dev-vertueux', 'dev-fifame'];
    }
  });

  const [pendingSentInvitations, setPendingSentInvitations] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('devconnect_pending_sent_invitations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [pendingReceivedInvitations, setPendingReceivedInvitations] = useState(() => [
    {
      id: 'inv-kodjo',
      devId: 'dev-kodjo',
      name: 'Kodjo MENSAH',
      title: 'DevOps & Kubernetes Specialist',
      avatar: avatarKodjo,
      location: 'Cotonou (Haie Vive)',
      mutualCount: 5,
      timeAgo: 'Il y a 2h',
    },
    {
      id: 'inv-sena',
      devId: 'dev-sena',
      name: 'Sèna TOSSOU',
      title: 'Data Scientist & Python Senior',
      avatar: avatarSena,
      location: 'Abomey-Calavi',
      mutualCount: 8,
      timeAgo: 'Il y a 1j',
    },
  ]);

  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 3200);
  };

  const sendInvitation = (devId: string, _devName?: string) => {
    if (connectedDevIds.includes(devId)) {
      triggerToast("Déjà connecté");
      return;
    }
    if (pendingSentInvitations.includes(devId)) {
      triggerToast("Envoyé");
      return;
    }
    const updated = [...pendingSentInvitations, devId];
    setPendingSentInvitations(updated);
    try {
      localStorage.setItem('devconnect_pending_sent_invitations', JSON.stringify(updated));
    } catch {}
    triggerToast("Envoyé");
  };

  const cancelInvitation = (devId: string) => {
    const updated = pendingSentInvitations.filter((id) => id !== devId);
    setPendingSentInvitations(updated);
    try {
      localStorage.setItem('devconnect_pending_sent_invitations', JSON.stringify(updated));
    } catch {}
    triggerToast("Invitation annulée.");
  };

  const acceptInvitation = (invitationId: string) => {
    const found = pendingReceivedInvitations.find((inv) => inv.id === invitationId);
    if (!found) return;
    const updatedReceived = pendingReceivedInvitations.filter((inv) => inv.id !== invitationId);
    setPendingReceivedInvitations(updatedReceived);
    const updatedConnected = Array.from(new Set([...connectedDevIds, found.devId]));
    setConnectedDevIds(updatedConnected);
    try {
      localStorage.setItem('devconnect_connected_devs', JSON.stringify(updatedConnected));
    } catch {}
    triggerToast(`Vous êtes désormais en relation avec ${found.name} !`);
  };

  const rejectInvitation = (invitationId: string) => {
    setPendingReceivedInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    triggerToast("Invitation déclinée.");
  };

  const disconnectDeveloper = (devId: string) => {
    const updated = connectedDevIds.filter((id) => id !== devId);
    setConnectedDevIds(updated);
    try {
      localStorage.setItem('devconnect_connected_devs', JSON.stringify(updated));
    } catch {}
    triggerToast("Relation retirée de votre réseau.");
  };

  const getConnectionStatus = (devId: string): 'none' | 'pending' | 'connected' => {
    if (connectedDevIds.includes(devId)) return 'connected';
    if (pendingSentInvitations.includes(devId)) return 'pending';
    return 'none';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('devconnect_lang', lang);
    } catch {
      /* Quota exceeded ou cookies désactivés */
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('devconnect_theme', t);
    } catch {
      /* Pas grave si le theme ne persiste pas en mode navigation privée */
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const login = (userData: Partial<CurrentUserProfile>) => {
    const formattedName = formatNameWithUpperLastName(userData.name || currentUser.name);
    const updated: CurrentUserProfile = {
      ...currentUser,
      ...userData,
      name: formattedName,
    };
    setCurrentUser(updated);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('devconnect_auth_session', 'true');
      localStorage.setItem('devconnect_user_profile', JSON.stringify(updated));
    } catch {
      /* LocalStorage indisponible */
    }
  };

  // Check au démarrage pour voir si une session Laravel Sanctum est encore vivante
  useEffect(() => {
    let mounted = true;

    authApi.getMe()
      .then((backendUser) => {
        if (!mounted || !backendUser) return;

        setIsLoggedIn(true);
        setCurrentUser((prev) => ({
          ...prev,
          id: String(backendUser.id),
          name: formatNameWithUpperLastName(backendUser.name),
          email: backendUser.email || prev.email,
          skills: backendUser.skills || prev.skills,
          language: backendUser.language,
        }));
      })
      .catch(() => {
        // Backend hors-ligne ou non démarré, session locale préservée
      });

    return () => {
      mounted = false;
    };
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    // Notifie le backend Laravel Sanctum de la déconnexion
    authApi.logout().catch(() => {});
    try {
      localStorage.setItem('devconnect_auth_session', 'false');
    } catch {
      /* Osef si l'écriture échoue */
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const openLegalModal = (tab: 'cgu' | 'privacy' | 'mentions' = 'cgu') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('devconnect_user_profile', JSON.stringify(currentUser));
    } catch {
      /* Ignore si stockage plein */
    }
  }, [currentUser]);

  const updateCurrentUser = (updates: Partial<CurrentUserProfile>) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('devconnect_user_profile', JSON.stringify(next));
      } catch {
        /* Évite le plantage si quota plein */
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        isLoggedIn,
        login,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        legalModalOpen,
        setLegalModalOpen,
        legalModalTab,
        setLegalModalTab,
        openLegalModal,
        inspectDeveloper,
        setInspectDeveloper,
        sitemapModalOpen,
        setSitemapModalOpen,
        pwaModalOpen,
        setPwaModalOpen,
        aiDrawerOpen,
        setAiDrawerOpen,
        searchModalOpen,
        setSearchModalOpen,
        cookieModalOpen,
        setCookieModalOpen,
        feedbackModalOpen,
        setFeedbackModalOpen,
        faqModalOpen,
        setFaqModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        nvTeamModalOpen,
        setNvTeamModalOpen,
        connectedDevIds,
        pendingSentInvitations,
        pendingReceivedInvitations,
        sendInvitation,
        cancelInvitation,
        acceptInvitation,
        rejectInvitation,
        disconnectDeveloper,
        getConnectionStatus,
        toastNotification,
        triggerToast,
        tabBadges,
        clearTabBadge,
        incrementTabBadge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être invoqué à l\'intérieur de AppProvider');
  }
  return context;
}