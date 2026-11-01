import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Globe,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatFullName } from '../../utils/formatters';
import { authApi } from '../../api';

export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'BJ', name: 'Bénin', dialCode: '+229' },
  { code: 'TG', name: 'Togo', dialCode: '+228' },
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'NE', name: 'Niger', dialCode: '+227' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'US', name: 'États-Unis', dialCode: '+1' },
];

// Modale d'authentification et inscription.
// Détection automatique de l'opérateur GSM béninois (MTN, Moov, Celtiis) selon le préfixe du numéro.

function detecterOperateurBenin(num: string): { nom: string; couleur: string } | null {
  const clean = num.replace(/\D/g, '');
  if (clean.length < 2) return null;
  const prefix = clean.slice(-8, -6);
  if (['61', '62', '66', '67', '69', '96', '97'].includes(prefix)) {
    return { nom: 'MTN Bénin', couleur: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' };
  }
  if (['94', '95', '60', '64', '65', '68'].includes(prefix)) {
    return { nom: 'Moov Africa', couleur: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200' };
  }
  if (['40', '41', '42', '43', '44', '45'].includes(prefix)) {
    return { nom: 'Celtiis Bénin', couleur: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200' };
  }
  return { nom: 'Réseau Bénin', couleur: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200' };
}

export function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    openLegalModal,
  } = useApp();

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('+229 ');
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birthDate, setBirthDate] = useState('01/01/2000');
  const [maritalStatus, setMaritalStatus] = useState<'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Autre'>('Célibataire');
  const [isBirthDatePublic, setIsBirthDatePublic] = useState(false);
  const [isMaritalStatusPublic, setIsMaritalStatusPublic] = useState(false);
  const [isPhonePublic, setIsPhonePublic] = useState(false);
  const [ville, setVille] = useState('Cotonou');
  const [specialite, setSpecialite] = useState('Développeur Fullstack React & Node.js');
  const [tauxHoraireFCFA, setTauxHoraireFCFA] = useState(25000);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = COUNTRY_OPTIONS.find((c) => c.code === e.target.value) || COUNTRY_OPTIONS[0];
    setSelectedCountry(found);
    const digitsOnly = telephone.replace(/^\+\d+\s*/, '').trim();
    setTelephone(`${found.dialCode} ${digitsOnly}`);
  };

  const goToStep2 = () => {
    setFormError(null);
    if (!prenom.trim() || !nom.trim()) {
      setFormError('Veuillez renseigner votre prénom et votre nom de famille.');
      return;
    }
    setRegisterStep(2);
  };

  const goToStep3 = () => {
    setFormError(null);
    if (!email.trim() || !email.includes('@')) {
      setFormError('Veuillez fournir une adresse email valide.');
      return;
    }
    const digits = telephone.replace(/\D/g, '');
    if (digits.length < 6) {
      setFormError('Veuillez fournir un numéro de téléphone valide.');
      return;
    }
    setRegisterStep(3);
  };

  if (!authModalOpen) return null;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasMinLength, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;

  const operateur = detecterOperateurBenin(telephone);

  const handleGoogleAuth = () => {
    setIsLoadingGoogle(true);
    setFormError(null);
    setTimeout(() => {
      login({
        name: 'Gbenagnon Narcisse AVLESSI',
        email: 'narcisseavlessi58@gmail.com',
        role: 'Lead Architecte Frontend',
        title: 'Lead Architecte Frontend • CADEV 2026',
        location: 'Cotonou',
        country: 'Bénin',
        residenceCity: 'Cotonou (Haie Vive)',
        phoneNumber: '+229 01 00 00 00',
        birthDate: '01/01/2000',
        maritalStatus: 'Célibataire',
        isBirthDatePublic: false,
        isMaritalStatusPublic: false,
        isPhonePublic: false,
      });
      setIsLoadingGoogle(false);
      setSuccessToast('Authentification Google réussie ! Bienvenue sur DevConnect, Gbenagnon Narcisse AVLESSI.');
      setTimeout(() => {
        setSuccessToast(null);
        setAuthModalOpen(false);
      }, 1200);
    }, 700);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!prenom.trim() || !nom.trim()) {
      setFormError('Veuillez renseigner votre prénom et votre nom de famille.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Veuillez fournir une adresse email valide.');
      return;
    }
    if (strengthScore < 2) {
      setFormError('Veuillez choisir un mot de passe plus fort (minimum 8 caractères, majuscule et chiffre).');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptCGU || !acceptPrivacy) {
      setFormError('Vous devez accepter les Conditions Générales et la Politique de Confidentialité (APDP) pour vous inscrire.');
      return;
    }

    const nomFormate = formatFullName(prenom, nom);
    const usernameGenerated = `${prenom.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}_${nom.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}`.slice(0, 30) || 'dev_user';

    // Tentative de connexion au backend Laravel si disponible
    try {
      const backendUser = await authApi.register({
        name: nomFormate,
        username: usernameGenerated,
        email: email.trim(),
        password,
        password_confirmation: confirmPassword,
        language: 'fr',
      });
      if (backendUser) {
        console.info('[DevConnect API] Inscription backend réussie :', backendUser);
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      if (apiErr?.response?.data?.errors) {
        const errorMessages = Object.values(apiErr.response.data.errors).flat().join(' ');
        setFormError(errorMessages || apiErr.response.data.message || "Erreur lors de l'inscription backend.");
        return;
      }
      console.info('[DevConnect API] Backend hors-ligne ou non joignable, poursuite en session locale.');
    }

    login({
      name: nomFormate,
      email: email.trim(),
      role: specialite,
      title: specialite,
      location: ville,
      country: selectedCountry.name,
      residenceCity: `${ville} (${selectedCountry.name})`,
      phoneNumber: telephone.trim(),
      birthDate,
      maritalStatus,
      isBirthDatePublic,
      isMaritalStatusPublic,
      isPhonePublic,
      hourlyRate: Number(tauxHoraireFCFA) || 25000,
    });

    setSuccessToast(`Compte créé avec succès ! Bienvenue, ${nomFormate}.`);
    setTimeout(() => {
      setSuccessToast(null);
      setAuthModalOpen(false);
    }, 1400);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFormError('Veuillez renseigner vos identifiants.');
      return;
    }

    // Tentative de connexion au backend Laravel si disponible
    try {
      const backendUser = await authApi.login({
        email: loginEmail.trim(),
        password: loginPassword.trim(),
      });
      if (backendUser) {
        console.info('[DevConnect API] Connexion backend réussie :', backendUser);
        login({
          name: backendUser.name,
          email: backendUser.email || loginEmail.trim(),
          role: backendUser.bio || 'Ingénieur Logiciel',
          title: backendUser.bio || 'Développeur Fullstack',
        });
        setSuccessToast(`Connexion réussie ! Heureux de vous revoir, ${backendUser.name}.`);
        setTimeout(() => {
          setSuccessToast(null);
          setAuthModalOpen(false);
        }, 1000);
        return;
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } } };
      if (apiErr?.response?.data?.errors) {
        const errorMessages = Object.values(apiErr.response.data.errors).flat().join(' ');
        setFormError(errorMessages || apiErr.response.data.message || 'Identifiants incorrects.');
        return;
      } else if (apiErr?.response?.status === 429) {
        setFormError('Trop de tentatives. Veuillez patienter une minute avant de réessayer.');
        return;
      }
      console.info('[DevConnect API] Backend non accessible, connexion locale.');
    }

    login({
      email: loginEmail.trim(),
    });

    setSuccessToast('Connexion réussie ! Heureux de vous revoir.');
    setTimeout(() => {
      setSuccessToast(null);
      setAuthModalOpen(false);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/70 sm:backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setAuthModalOpen(false);
      }}
    >
      <div className="relative w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-2xl flex flex-col bg-white/95 dark:bg-slate-900/95 sm:backdrop-blur-3xl border-0 sm:border border-white/60 dark:border-white/10 rounded-none sm:rounded-3xl shadow-none sm:shadow-[0_25px_70px_-15px_rgba(0,102,255,0.3)] overflow-hidden">
        {/* Texture de grain mathématique élégante en arrière-plan de la modale */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] mathematical-grain-bg" aria-hidden="true" />

        {successToast && (
          <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-50 p-3.5 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-blue-50/60 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 shrink-0 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center border border-[#0066FF]/20 shadow-sm shrink-0">
              {authModalMode === 'register' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                {authModalMode === 'register' ? 'Créer un Compte Développeur' : 'Accéder à votre Espace'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">
                Écosystème tech d'élite au Bénin
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 p-1.5 mx-4 sm:mx-6 mt-3 sm:mt-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 relative z-10">
          <button
            onClick={() => {
              setAuthModalMode('register');
              setFormError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
              authModalMode === 'register'
                ? 'bg-white dark:bg-slate-900 text-[#0066FF] dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Créer un compte
          </button>
          <button
            onClick={() => {
              setAuthModalMode('login');
              setFormError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
              authModalMode === 'login'
                ? 'bg-white dark:bg-slate-900 text-[#0066FF] dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Se connecter
          </button>
        </div>

        <div className="px-4 sm:px-6 pt-3 sm:pt-4 shrink-0 relative z-10">
          <button
            onClick={handleGoogleAuth}
            disabled={isLoadingGoogle}
            className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoadingGoogle
                ? 'Connexion sécurisée en cours...'
                : 'Continuer avec un compte Google (Gmail)'}
            </span>
          </button>

          <div className="flex items-center gap-3 my-3 sm:my-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Ou par formulaire direct
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {formError && (
          <div className="mx-4 sm:mx-6 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 shrink-0 relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-2 space-y-4 relative z-10 pb-8 sm:pb-4">
          {authModalMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Barre de progression & Stepper visuel pas à pas */}
              <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#0066FF] dark:text-cyan-400">
                    {registerStep === 1 && 'Étape 1 sur 3 : Identité & Nom'}
                    {registerStep === 2 && 'Étape 2 sur 3 : Coordonnées & Téléphone'}
                    {registerStep === 3 && 'Étape 3 sur 3 : Sécurité & Finalisation'}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {registerStep === 1 ? '33%' : registerStep === 2 ? '66%' : '100%'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0066FF] to-cyan-400 transition-all duration-300 ease-out"
                    style={{ width: registerStep === 1 ? '33%' : registerStep === 2 ? '66%' : '100%' }}
                  />
                </div>
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {[
                    { step: 1, label: 'Identité' },
                    { step: 2, label: 'Coordonnées' },
                    { step: 3, label: 'Sécurité' },
                  ].map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => {
                        if (item.step < registerStep) {
                          setFormError(null);
                          setRegisterStep(item.step as 1 | 2 | 3);
                        }
                      }}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                        registerStep === item.step
                          ? 'bg-blue-100 dark:bg-blue-950/70 text-[#0066FF] dark:text-cyan-300 ring-1 ring-blue-300 dark:ring-blue-700'
                          : item.step < registerStep
                          ? 'text-emerald-600 dark:text-emerald-400 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : 'text-slate-400 cursor-default'
                      }`}
                    >
                      {item.step < registerStep ? <Check className="w-3 h-3" /> : <span>{item.step}.</span>}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu des étapes avec défilement fluide vers la gauche */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  {registerStep === 1 && (
                    <motion.div
                      key="register-step-1"
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -25 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            placeholder="Ex: Mahouna"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Nom de famille (enregistré en majuscules) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Ex: DOSSOU"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Spécialité tech ou Rôle principal
                        </label>
                        <input
                          type="text"
                          value={specialite}
                          onChange={(e) => setSpecialite(e.target.value)}
                          placeholder="Ex: Lead Développeur Frontend React"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          fullWidth
                          onClick={goToStep2}
                          iconRight={<ArrowRight className="w-4 h-4 shrink-0" />}
                          className="!h-12 py-3 px-4 rounded-2xl font-bold !flex !flex-row !flex-nowrap !items-center !justify-center gap-2 shadow-lg shadow-blue-500/25 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                        >
                          <span className="whitespace-nowrap font-bold">Continuer vers mes coordonnées</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {registerStep === 2 && (
                    <motion.div
                      key="register-step-2"
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -25 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Adresse email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre.nom@email.com"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Pays de résidence &amp; Indicatif <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <select
                              value={selectedCountry.code}
                              onChange={handleCountrySelect}
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                            >
                              {COUNTRY_OPTIONS.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.name} ({c.dialCode})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700 dark:text-slate-300">
                              Numéro de téléphone <span className="text-red-500">*</span>
                            </label>
                            {selectedCountry.code === 'BJ' && operateur && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${operateur.couleur}`}>
                                {operateur.nom}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="tel"
                              required
                              value={telephone}
                              onChange={(e) => setTelephone(e.target.value)}
                              placeholder={`${selectedCountry.dialCode} 97 00 00 00`}
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Ville de résidence
                          </label>
                          <select
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            <option value="Cotonou">Cotonou</option>
                            <option value="Porto-Novo">Porto-Novo</option>
                            <option value="Abomey-Calavi">Abomey-Calavi</option>
                            <option value="Parakou">Parakou</option>
                            <option value="Ouidah">Ouidah</option>
                            <option value="Natitingou">Natitingou</option>
                            <option value="Autre">Autre ville</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Taux horaire indicatif (FCFA/h)
                          </label>
                          <input
                            type="number"
                            step="1000"
                            min="5000"
                            value={tauxHoraireFCFA}
                            onChange={(e) => setTauxHoraireFCFA(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2.5">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setFormError(null); setRegisterStep(1); }}
                          iconLeft={<ArrowLeft className="w-4 h-4 shrink-0" />}
                          className="!h-12 py-3 px-4 rounded-2xl font-bold !flex !flex-row !flex-nowrap !items-center !justify-center gap-2 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                        >
                          <span className="whitespace-nowrap font-bold">Retour</span>
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          fullWidth
                          onClick={goToStep3}
                          iconRight={<ArrowRight className="w-4 h-4 shrink-0" />}
                          className="!h-12 py-3 px-4 rounded-2xl font-bold !flex !flex-row !flex-nowrap !items-center !justify-center gap-2 shadow-lg shadow-blue-500/25 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                        >
                          <span className="whitespace-nowrap font-bold">Continuer vers la sécurité</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {registerStep === 3 && (
                    <motion.div
                      key="register-step-3"
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -25 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Mot de passe <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Confirmer le mot de passe <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                              />
                            </div>
                          </div>
                        </div>

                        {password.length > 0 && (
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-semibold">
                              <span>Force du mot de passe :</span>
                              <span
                                className={
                                  strengthScore <= 1
                                    ? 'text-rose-500'
                                    : strengthScore === 2
                                    ? 'text-amber-500'
                                    : strengthScore === 3
                                    ? 'text-blue-500'
                                    : 'text-emerald-500'
                                }
                              >
                                {strengthScore <= 1
                                  ? 'Faible'
                                  : strengthScore === 2
                                  ? 'Moyen'
                                  : strengthScore === 3
                                  ? 'Fort'
                                  : 'Très robuste'}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  strengthScore <= 1
                                    ? 'w-1/4 bg-rose-500'
                                    : strengthScore === 2
                                    ? 'w-2/4 bg-amber-500'
                                    : strengthScore === 3
                                    ? 'w-3/4 bg-blue-500'
                                    : 'w-full bg-emerald-500'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                            <span>État Civil &amp; Visibilité (Optionnel)</span>
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                              Date de naissance (JJ/MM/AAAA)
                            </label>
                            <input
                              type="text"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              placeholder="18/04/1996"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                              Situation matrimoniale
                            </label>
                            <select
                              value={maritalStatus}
                              onChange={(e) =>
                                setMaritalStatus(e.target.value as 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Autre')
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                            >
                              <option value="Célibataire">Célibataire</option>
                              <option value="Marié(e)">Marié(e)</option>
                              <option value="Divorcé(e)">Divorcé(e)</option>
                              <option value="Autre">Autre</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={acceptCGU}
                            onChange={(e) => setAcceptCGU(e.target.checked)}
                            className="mt-0.5 rounded text-[#0066FF]"
                          />
                          <span>
                            J'accepte les{' '}
                            <button
                              type="button"
                              onClick={() => openLegalModal('cgu')}
                              className="text-[#0066FF] underline font-semibold cursor-pointer"
                            >
                              Conditions Générales d'Utilisation (CGU)
                            </button>. <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={acceptPrivacy}
                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                            className="mt-0.5 rounded text-[#0066FF]"
                          />
                          <span>
                            J'accepte la{' '}
                            <button
                              type="button"
                              onClick={() => openLegalModal('privacy')}
                              className="text-[#0066FF] underline font-semibold cursor-pointer"
                            >
                              Politique de Confidentialité (APDP Bénin)
                            </button>. <span className="text-red-500">*</span>
                          </span>
                        </label>
                      </div>

                      <div className="pt-2 flex items-center gap-2.5">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setFormError(null); setRegisterStep(2); }}
                          iconLeft={<ArrowLeft className="w-4 h-4 shrink-0" />}
                          className="!h-12 py-3 px-4 rounded-2xl font-bold !flex !flex-row !flex-nowrap !items-center !justify-center gap-2 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                        >
                          <span className="whitespace-nowrap font-bold">Retour</span>
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          fullWidth
                          iconRight={<ArrowRight className="w-4 h-4 shrink-0" />}
                          className="!h-12 py-3 px-4 rounded-2xl font-bold !flex !flex-row !flex-nowrap !items-center !justify-center gap-2 shadow-lg shadow-blue-500/25 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                        >
                          <span className="whitespace-nowrap font-bold">Finaliser mon inscription</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs py-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse email ou Numéro de téléphone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="narcisseavlessi58@gmail.com ou +229..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  iconRight={<ArrowRight className="w-4 h-4 shrink-0" />}
                  className="!h-12 py-3 px-4 rounded-2xl font-bold !flex !flex-row !flex-nowrap !items-center !justify-center gap-2 shadow-lg shadow-blue-500/25 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                >
                  <span className="whitespace-nowrap font-bold">Se connecter à mon compte</span>
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-center text-[11px] text-slate-500 shrink-0 relative z-10 pb-safe">
          DevConnect &middot; Écosystème des Développeurs & Entreprises Tech
        </div>
      </div>
    </div>
  );
}
