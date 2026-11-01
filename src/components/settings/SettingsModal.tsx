import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  User,
  Lock,
  Eye,
  Bell,
  MessageSquare,
  Download,
  Trash2,
  X,
  Check,
  Smartphone,
  Laptop,
  KeyRound,
  Volume2,
  Clock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatNameWithUpperLastName } from '../../utils/formatters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'account' | 'security' | 'privacy' | 'messaging' | 'notifications' | 'data';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { currentUser, updateCurrentUser, theme, language } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // États locaux du formulaire profil (je garde le state local pour pouvoir cancel sans polluer le context)
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title || currentUser.role);
  const [residenceCity, setResidenceCity] = useState(currentUser.residenceCity || 'Cotonou, Bénin');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '+229 01 95 00 00 00');
  const [hourlyRate, setHourlyRate] = useState(currentUser.hourlyRate || 25000);
  const [isPhonePublic, setIsPhonePublic] = useState(currentUser.isPhonePublic ?? true);

  // Sécurité et double authentification (persistance locale tant que le backend Sanctum 2FA est en chantier)
  const [twoFactorAuth, setTwoFactorAuth] = useState(() => {
    return localStorage.getItem('devconnect_2fa_enabled') === 'true';
  });

  // Réglages de visibilité style grand réseau social (demande expresse de la commu dev)
  const [profileVisibility, setProfileVisibility] = useState(() => {
    return localStorage.getItem('devconnect_profile_visibility') || 'public';
  });
  const [groupAddPermission, setGroupAddPermission] = useState(() => {
    return localStorage.getItem('devconnect_group_add_perm') || 'everyone';
  });
  const [onlineStatusVisible, setOnlineStatusVisible] = useState(() => {
    return localStorage.getItem('devconnect_online_status') !== 'false';
  });

  // Toggles de confort pour le chat temps réel
  const [readReceipts, setReadReceipts] = useState(() => {
    return localStorage.getItem('devconnect_read_receipts') !== 'false';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('devconnect_msg_sound') !== 'false';
  });
  const [defaultEphemeral, setDefaultEphemeral] = useState(() => {
    return localStorage.getItem('devconnect_default_ephemeral') || 'off';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedName = formatNameWithUpperLastName(name);
    updateCurrentUser({
      name: formattedName,
      title,
      residenceCity,
      phoneNumber,
      hourlyRate: Number(hourlyRate),
      isPhonePublic,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggle2FA = () => {
    const nextVal = !twoFactorAuth;
    setTwoFactorAuth(nextVal);
    localStorage.setItem('devconnect_2fa_enabled', String(nextVal));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleVisibilityChange = (val: string) => {
    setProfileVisibility(val);
    localStorage.setItem('devconnect_profile_visibility', val);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleGroupPermChange = (val: string) => {
    setGroupAddPermission(val);
    localStorage.setItem('devconnect_group_add_perm', val);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    const exportPayload = {
      app: 'DevConnect Bénin',
      version: '2026.1 (CADEV)',
      exportDate: new Date().toISOString(),
      user: currentUser,
      preferences: {
        theme,
        language,
        twoFactorAuth,
        profileVisibility,
        groupAddPermission,
        defaultEphemeral,
      },
      compliance: 'Autorité de Protection des Données Personnelles (APDP Bénin - Loi N° 2017-20)',
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devconnect-data-${currentUser.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#090D1A] text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_25px_70px_-15px_rgba(0,102,255,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        <div className="h-16 px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/90 dark:bg-[#070B16]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Paramètres & Confidentialité</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-[#0066FF] dark:text-cyan-400 font-bold">
                  DevConnect Pro
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gérez vos accès de sécurité, visibilité publique et préférences de discussion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Enregistré !</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps avec onglets verticaux sur desktop et horizontaux sur mobile */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Menu latéral des onglets */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060914] shrink-0 p-2 sm:p-3 overflow-x-auto md:overflow-y-auto no-scrollbar flex md:flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profil & Coordonnées</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Sécurité & Sessions (2FA)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Confidentialité & Visibilité</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('messaging')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'messaging'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Messagerie & Groupes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications & Alertes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Vos Données (APDP Bénin)</span>
            </button>
          </aside>

          {/* Zone de contenu de l'onglet actif */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-6">
            {/* ONGLET 1 : COMPTE & IDENTITÉ */}
            {activeTab === 'account' && (
              <form onSubmit={handleSaveAccount} className="space-y-4 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                    Informations du profil développeur
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ces informations apparaissent dans les salons de discussion, les groupes et le réseau d'ingénieurs.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nom complet (Le Nom de famille sera formaté en MAJUSCULE)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre professionnel & Spécialité
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Lead Architecte Frontend • React 19"
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Ville de résidence au Bénin
                      </label>
                      <input
                        type="text"
                        value={residenceCity}
                        onChange={(e) => setResidenceCity(e.target.value)}
                        placeholder="Ex: Cotonou (Haie Vive)"
                        className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tarif horaire (FCFA/h)
                      </label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        step={1000}
                        className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Numéro de téléphone / WhatsApp professionnel (+229)
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+229 01 95 00 00 00"
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPhonePublic}
                      onChange={(e) => setIsPhonePublic(e.target.checked)}
                      className="w-4 h-4 text-[#0066FF] rounded border-slate-300 focus:ring-0"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Afficher publiquement mon contact sur mon profil DevConnect
                    </span>
                  </label>
                </div>

                <div className="pt-3">
                  <Button type="submit" variant="primary" size="md" className="!rounded-xl font-bold">
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            )}

            {/* ONGLET 2 : SÉCURITÉ & SESSIONS */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                    Sécurité du compte & Authentification
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Protégez vos messages confidentiels et vos codes partagés sur DevConnect.
                  </p>
                </div>

                {/* 2FA Card */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D1326] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#0066FF] flex items-center justify-center shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          Authentification à deux facteurs (2FA)
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Exige un code SMS ou une application d'authentification lors de la connexion.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={toggle2FA}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        twoFactorAuth
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {twoFactorAuth ? 'Activé' : 'Désactivé'}
                    </button>
                  </div>
                </div>

                {/* Sessions Actives */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Où vous êtes actuellement connecté
                    </h4>
                    <span className="text-[11px] text-emerald-500 font-bold">2 sessions actives</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-[#0066FF]" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Chrome sur macOS (Cotonou, Bénin)
                          </p>
                          <p className="text-[10px] text-emerald-500 font-medium">
                            Cet appareil • Session active maintenant
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0066FF] font-bold">
                        Actuel
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            DevConnect PWA (Abomey-Calavi, Bénin)
                          </p>
                          <p className="text-[10px] text-slate-500">Dernière activité il y a 2 heures</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Session mobile déconnectée avec succès.')}
                        className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Déconnecter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Changer de mot de passe */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Modifier le mot de passe
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="password"
                      placeholder="Mot de passe actuel"
                      className="h-9 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700"
                    />
                    <input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      className="h-9 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Mot de passe mis à jour avec succès.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-900"
                  >
                    Mettre à jour
                  </button>
                </div>
              </div>
            )}

            {/* ONGLET 3 : CONFIDENTIALITÉ & VISIBILITÉ (Comme Facebook) */}
            {activeTab === 'privacy' && (
              <div className="space-y-5 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                    Paramètres de confidentialité (Style Réseau Social)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Contrôlez qui peut voir vos contenus, vous ajouter aux groupes et voir votre disponibilité.
                  </p>
                </div>

                {/* Qui peut voir mon profil */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Qui peut voir votre profil et vos compétences techniques ?
                  </label>
                  <select
                    value={profileVisibility}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 cursor-pointer"
                  >
                    <option value="public">Tout le monde (Public - Recommandé pour missions freelance)</option>
                    <option value="network">Réseau DevConnect uniquement (Membres connectés)</option>
                    <option value="private">Recruteurs et Partenaires certifiés CADEV uniquement</option>
                  </select>
                </div>

                {/* Qui peut m'ajouter dans un groupe */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Qui peut vous ajouter directement dans un groupe de discussion ?
                  </label>
                  <select
                    value={groupAddPermission}
                    onChange={(e) => handleGroupPermChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 cursor-pointer"
                  >
                    <option value="everyone">Tous les développeurs de la plateforme</option>
                    <option value="contacts">Uniquement les développeurs avec qui j'ai déjà échangé</option>
                    <option value="approval">Exiger mon approbation préalable par invitation</option>
                  </select>
                </div>

                {/* Statut en ligne */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Afficher votre statut en ligne
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Indique aux autres membres quand vous êtes actif sur DevConnect.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlineStatusVisible}
                    onChange={(e) => {
                      setOnlineStatusVisible(e.target.checked);
                      localStorage.setItem('devconnect_online_status', String(e.target.checked));
                    }}
                    className="w-4 h-4 text-[#0066FF] rounded border-slate-300"
                  />
                </div>
              </div>
            )}

            {/* ONGLET 4 : MESSAGERIE & GROUPES */}
            {activeTab === 'messaging' && (
              <div className="space-y-5 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                    Préférences de discussion & Salons
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Règles de suppression, modification des messages (max 15 min) et messages éphémères.
                  </p>
                </div>

                {/* Règle des 15 minutes rappel */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Règle de modification DevConnect :</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Conformément aux normes d'audit technique, tout message envoyé ne peut être modifié que durant un délai maximal de <strong>15 minutes</strong>. Passé ce délai, le bouton de modification est verrouillé pour garantir l'intégrité des échanges techniques.
                    </p>
                  </div>
                </div>

                {/* Messages éphémères par défaut */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Durée par défaut des messages éphémères dans vos nouveaux groupes
                  </label>
                  <select
                    value={defaultEphemeral}
                    onChange={(e) => {
                      setDefaultEphemeral(e.target.value);
                      localStorage.setItem('devconnect_default_ephemeral', e.target.value);
                    }}
                    className="w-full h-10 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0D1326] border border-slate-300 dark:border-slate-700 cursor-pointer"
                  >
                    <option value="off">Désactivé (Messages permanents)</option>
                    <option value="15m">15 minutes (Haute confidentialité)</option>
                    <option value="24h">24 heures (Éphémère quotidien)</option>
                    <option value="7d">7 jours (Revue hebdomadaire)</option>
                  </select>
                </div>

                {/* Sons et confirmations */}
                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4 h-4 text-[#0066FF]" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Sons de notification des messages
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => {
                        setSoundEnabled(e.target.checked);
                        localStorage.setItem('devconnect_msg_sound', String(e.target.checked));
                      }}
                      className="w-4 h-4 text-[#0066FF] rounded border-slate-300"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Confirmations de lecture (Vu)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={readReceipts}
                      onChange={(e) => {
                        setReadReceipts(e.target.checked);
                        localStorage.setItem('devconnect_read_receipts', String(e.target.checked));
                      }}
                      className="w-4 h-4 text-[#0066FF] rounded border-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ONGLET 5 : NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-5 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                    Notifications Push & Alertes
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restez informé des opportunités de freelance en FCFA et des messages urgents.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Alertes de nouvelles missions freelance en FCFA
                      </p>
                      <p className="text-[11px] text-slate-500">Dès qu'une opportunité correspond à vos compétences</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0066FF] rounded border-slate-300" />
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Mentions dans les groupes et commentaires
                      </p>
                      <p className="text-[11px] text-slate-500">Quand un confrère vous cite dans le code</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0066FF] rounded border-slate-300" />
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Notifications Push sur mobile (PWA)
                      </p>
                      <p className="text-[11px] text-slate-500">Alertes sur écran de verrouillage Android / iOS</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0066FF] rounded border-slate-300" />
                  </div>
                </div>
              </div>
            )}

            {/* ONGLET 6 : VOS DONNÉES & APDP */}
            {activeTab === 'data' && (
              <div className="space-y-5 max-w-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                    Conformité APDP Bénin & Gestion des Données
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Conformément à la Loi N° 2017-20 du Bénin, vous disposez d'un droit complet d'accès, de portabilité et d'effacement de vos données.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D1326] space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Download className="w-4 h-4 text-[#0066FF]" />
                    <span>Télécharger l'intégralité de vos données (JSON)</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Générez une copie sécurisée de votre profil, historique de messages, projets publiés et préférences de compte.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    className="!rounded-xl font-bold"
                  >
                    {exportSuccess ? 'Archive téléchargée avec succès !' : 'Générer & Télécharger mes données'}
                  </Button>
                </div>

                <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                    <span>Suppression définitive du compte</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cette action purge immédiatement toutes vos données enregistrées en local et retire votre profil des listes d'ingénieurs.
                  </p>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm('Êtes-vous certain de vouloir supprimer vos données ? Cette action est irréversible.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="!rounded-xl font-bold"
                  >
                    Supprimer mon compte & mes données
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
