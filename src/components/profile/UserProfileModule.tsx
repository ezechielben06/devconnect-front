// Espace Profil développeur (édition, compétences, bio, liens GitHub/LinkedIn, TJM).
// On garde les modifications en local state pour pouvoir annuler sans toucher au contexte global à chaque frappe.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { retirerEmojis } from '../../utils/texte';
import { formatNameWithUpperLastName } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import {
  Edit3,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  Award,
  Globe,
  Github,
  Linkedin,
  Mail,
  Calendar,
  Heart,
  Phone,
  Lock,
  Eye,
  MessageCircle,
  Twitter,
  Instagram,
  Share2,
  ExternalLink,
  Send,
  Check,
  Settings,
  Youtube,
  LogIn,
  UserPlus,
} from 'lucide-react';

export function parseBirthDateHelper(raw: string): { isValid: boolean; formatted: string; age?: number } {
  const trimmed = raw.trim();
  if (!trimmed) return { isValid: false, formatted: '' };

  // Format JJ/MM/AAAA ou JJ-MM-AAAA ou JJ.MM.AAAA
  const frMatch = trimmed.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (frMatch) {
    const d = parseInt(frMatch[1], 10);
    const m = parseInt(frMatch[2], 10);
    const y = parseInt(frMatch[3], 10);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) {
      const today = new Date();
      let age = today.getFullYear() - y;
      if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) {
        age--;
      }
      return {
        isValid: true,
        formatted: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        age: age >= 0 ? age : undefined,
      };
    }
  }

  // Format AAAA-MM-JJ (ISO)
  const isoMatch = trimmed.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) {
      const today = new Date();
      let age = today.getFullYear() - y;
      if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) {
        age--;
      }
      return {
        isValid: true,
        formatted: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        age: age >= 0 ? age : undefined,
      };
    }
  }

  return { isValid: false, formatted: trimmed };
}

function formatBirthDateDisplay(dateStr?: string): string {
  if (!dateStr) return 'Non renseigné';
  const parsed = parseBirthDateHelper(dateStr);
  if (parsed.isValid) {
    return parsed.age !== undefined ? `${parsed.formatted} (${parsed.age} ans)` : parsed.formatted;
  }
  return dateStr;
}

export function normalizeSocialUrl(value: string, platform: string): string {
  let val = value.trim();
  if (!val) return '';
  if (val.startsWith('@')) val = val.slice(1);
  if (val.startsWith('http://') || val.startsWith('https://')) return val;

  if (platform === 'whatsapp') {
    const digits = val.replace(/[^0-9]/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  }
  if (platform === 'facebook') {
    if (val.startsWith('facebook.com/')) return `https://${val}`;
    return `https://facebook.com/${val}`;
  }
  if (platform === 'twitter' || platform === 'x') {
    if (val.startsWith('x.com/') || val.startsWith('twitter.com/')) return `https://${val}`;
    return `https://x.com/${val}`;
  }
  if (platform === 'instagram') {
    if (val.startsWith('instagram.com/')) return `https://${val}`;
    return `https://instagram.com/${val}`;
  }
  if (platform === 'snapchat') {
    if (val.startsWith('snapchat.com/add/')) return `https://${val}`;
    return `https://snapchat.com/add/${val}`;
  }
  if (platform === 'tiktok') {
    if (val.startsWith('tiktok.com/@')) return `https://${val}`;
    return `https://tiktok.com/@${val}`;
  }
  if (platform === 'github') {
    if (val.startsWith('github.com/')) return `https://${val}`;
    return `https://github.com/${val}`;
  }
  if (platform === 'linkedin') {
    if (val.startsWith('linkedin.com/in/')) return `https://${val}`;
    return `https://linkedin.com/in/${val}`;
  }
  if (platform === 'youtube') {
    if (val.startsWith('youtube.com/')) return `https://${val}`;
    return `https://youtube.com/@${val}`;
  }
  if (platform === 'telegram') {
    if (val.startsWith('t.me/')) return `https://${val}`;
    return `https://t.me/${val}`;
  }
  return `https://${val}`;
}

export function UserProfileModule() {
  const { language, currentUser, setCurrentUser, setSettingsModalOpen, isLoggedIn, openAuthModal, setActiveTab } = useApp();

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-[#0066FF] dark:text-cyan-400 shadow-inner">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Connexion requise pour accéder à votre profil
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Pour des raisons de confidentialité et de sécurité des données personnelles, vous devez être inscrit ou connecté pour consulter, personnaliser et gérer votre profil d'ingénieur.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold bg-[#0066FF] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex flex-row flex-nowrap items-center justify-center gap-2 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Se connecter</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all cursor-pointer flex flex-row flex-nowrap items-center justify-center gap-2 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-[#0066FF] dark:text-cyan-400 shrink-0" />
              <span>Créer un compte</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline underline-offset-4 cursor-pointer"
            >
              Retourner au fil d'actualités
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [editModalOpen, setEditModalOpen] = useState(false);

  const cleanNV = (str?: string) => (str ? str.replace(/•?\s*NV\s*TEAM\s*/gi, '').replace(/\s{2,}/g, ' ').trim() : '');

  const [editName, setEditName] = useState(currentUser.name);
  const [editTitle, setEditTitle] = useState(cleanNV(currentUser.title));
  const [editRole, setEditRole] = useState(cleanNV(currentUser.role));
  const [editRate, setEditRate] = useState(currentUser.hourlyRate);
  const [editLocation, setEditLocation] = useState(currentUser.location);
  const [editBioFr, setEditBioFr] = useState(cleanNV(currentUser.bioFr));
  const [editBioEn, setEditBioEn] = useState(cleanNV(currentUser.bioEn));
  const [editAvailability, setEditAvailability] = useState(currentUser.availability);
  const [editSkills, setEditSkills] = useState(currentUser.skills.join(', '));

  const [editBirthDate, setEditBirthDate] = useState(currentUser.birthDate || '18/04/1996');
  const [editMaritalStatus, setEditMaritalStatus] = useState<
    'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Autre'
  >(currentUser.maritalStatus || 'Célibataire');
  const [editIsBirthDatePublic, setEditIsBirthDatePublic] = useState(
    currentUser.isBirthDatePublic ?? false
  );
  const [editIsMaritalStatusPublic, setEditIsMaritalStatusPublic] = useState(
    currentUser.isMaritalStatusPublic ?? false
  );
  const [editPhone, setEditPhone] = useState(currentUser.phoneNumber || '+229 01 00 00 00');
  const [editIsPhonePublic, setEditIsPhonePublic] = useState(currentUser.isPhonePublic ?? false);

  const [editFacebook, setEditFacebook] = useState(currentUser.facebookUrl || '');
  const [editWhatsapp, setEditWhatsapp] = useState(currentUser.whatsappUrl || '+229 01 00 00 00');
  const [editTwitter, setEditTwitter] = useState(currentUser.twitterUrl || '');
  const [editInstagram, setEditInstagram] = useState(currentUser.instagramUrl || '');
  const [editSnapchat, setEditSnapchat] = useState(currentUser.snapchatUrl || '');
  const [editTiktok, setEditTiktok] = useState(currentUser.tiktokUrl || '');
  const [editYoutube, setEditYoutube] = useState(currentUser.youtubeUrl || '');
  const [editTelegram, setEditTelegram] = useState(currentUser.telegramUrl || '');
  const [editGithub, setEditGithub] = useState(currentUser.githubUrl || '');
  const [editLinkedin, setEditLinkedin] = useState(currentUser.linkedinUrl || '');
  const [editPortfolio, setEditPortfolio] = useState(currentUser.portfolioUrl || '');

  const countryWithoutEmoji = retirerEmojis(currentUser.country);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = editSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const formattedName = formatNameWithUpperLastName(editName.trim() || currentUser.name);

    setCurrentUser((prev) => ({
      ...prev,
      name: formattedName,
      title: editTitle.trim(),
      role: editRole.trim(),
      hourlyRate: Number(editRate),
      location: editLocation.trim(),
      bioFr: editBioFr.trim(),
      bioEn: editBioEn.trim(),
      availability: editAvailability,
      skills: skillsArray,
      birthDate: editBirthDate.trim(),
      maritalStatus: editMaritalStatus,
      isBirthDatePublic: editIsBirthDatePublic,
      isMaritalStatusPublic: editIsMaritalStatusPublic,
      phoneNumber: editPhone.trim(),
      isPhonePublic: editIsPhonePublic,
      facebookUrl: normalizeSocialUrl(editFacebook, 'facebook'),
      whatsappUrl: normalizeSocialUrl(editWhatsapp, 'whatsapp'),
      twitterUrl: normalizeSocialUrl(editTwitter, 'twitter'),
      instagramUrl: normalizeSocialUrl(editInstagram, 'instagram'),
      snapchatUrl: normalizeSocialUrl(editSnapchat, 'snapchat'),
      tiktokUrl: normalizeSocialUrl(editTiktok, 'tiktok'),
      youtubeUrl: normalizeSocialUrl(editYoutube, 'youtube'),
      telegramUrl: normalizeSocialUrl(editTelegram, 'telegram'),
      githubUrl: normalizeSocialUrl(editGithub, 'github'),
      linkedinUrl: normalizeSocialUrl(editLinkedin, 'linkedin'),
      portfolioUrl: normalizeSocialUrl(editPortfolio, 'portfolio'),
    }));

    setEditModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-6">
      {/* Carte principale de profil */}
      <Card
        featured
        className="p-5 sm:p-8 bg-white dark:bg-[#090D1A] border-blue-200/80 dark:border-slate-800/80 shadow-md dark:shadow-none rounded-3xl"
      >
        <div className="flex flex-col items-center justify-center text-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col items-center justify-center text-center gap-4 w-full">
            <div className="flex justify-center items-center mx-auto">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="xl"
                status={currentUser.availability}
              />
            </div>
            <div className="space-y-1.5 flex flex-col items-center text-center min-w-0 max-w-full">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[#0A1128] dark:text-slate-100 tracking-tight whitespace-nowrap">
                  {formatNameWithUpperLastName(currentUser.name)}
                </h1>
                {currentUser.verified && (
                  <span title="Profil vérifié par DevConnect Bénin">
                    <CheckCircle
                      className="w-5 h-5 text-[#0066FF] dark:text-cyan-400"
                      aria-label="Profil d'ingénieur vérifié"
                    />
                  </span>
                )}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] dark:bg-blue-950 dark:text-cyan-400 font-bold border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                  MON COMPTE
                </span>
              </div>
              <p className="text-sm font-semibold text-[#0066FF] dark:text-cyan-400 whitespace-nowrap">
                {cleanNV(currentUser.title)}
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <span className="flex items-center gap-1 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {currentUser.residenceCity || currentUser.location}, {countryWithoutEmoji}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0">&middot;</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums font-medium">
                    {currentUser.experienceYears} {language === 'fr' ? 'ans d\'expérience' : 'years experience'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="md"
              iconLeft={<Edit3 className="w-4 h-4 text-[#0066FF]" />}
              onClick={() => {
                setEditName(currentUser.name);
                setEditModalOpen(true);
              }}
              className="rounded-2xl w-auto font-bold whitespace-nowrap shrink-0"
            >
              {language === 'fr' ? 'Modifier le profil' : 'Edit profile'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              iconLeft={<Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
              onClick={() => setSettingsModalOpen(true)}
              className="rounded-2xl w-full sm:w-auto font-bold whitespace-nowrap shrink-0"
            >
              {language === 'fr' ? 'Paramètres & Confidentialité' : 'Settings & Privacy'}
            </Button>
          </div>
        </div>

        {/* Statistiques clés avec AFFICHAGE RESPONSIVE OPTIMISÉ DU PRIX ET FCFA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-5 sm:py-6 border-b border-slate-200 dark:border-slate-800/80">
          {/* Bloc Prix / Taux horaire 100% responsive sans débordement */}
          <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-900/40 border border-blue-100/60 dark:border-slate-800/60 space-y-1">
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'fr' ? 'Taux horaire moyen' : 'Hourly rate'}
            </p>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-base sm:text-lg lg:text-xl font-black font-mono tabular-nums text-[#0066FF] dark:text-cyan-400 whitespace-nowrap">
                {currentUser.hourlyRate.toLocaleString('fr-FR')}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
                FCFA/h
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'fr' ? 'Missions complétées' : 'Completed jobs'}
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-black font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {currentUser.completedProjectsCount}
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'fr' ? 'Score de réputation' : 'Reputation score'}
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {currentUser.reputation} <span className="text-[11px] sm:text-xs font-sans font-normal text-slate-400">pts</span>
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'fr' ? 'Statut de vérification' : 'Verification status'}
            </p>
            <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-0.5">
              <Shield className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{language === 'fr' ? 'Certifié DevConnect' : 'Verified'}</span>
            </p>
          </div>
        </div>

        {/* Section État Civil & Paramètres de Confidentialité */}
        <div className="py-6 border-b border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#0066FF]" />
              <span>État civil & Visibilité publique (APDP Bénin)</span>
            </h2>
            <span className="text-[11px] text-slate-500">Contrôle de vos informations privées</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Date de naissance</span>
                </span>
                <span className="text-[10px] font-bold">
                  {currentUser.isBirthDatePublic ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> Public
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Privé
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {formatBirthDateDisplay(currentUser.birthDate)}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Situation matrimoniale</span>
                </span>
                <span className="text-[10px] font-bold">
                  {currentUser.isMaritalStatusPublic ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> Public
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Privé
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {currentUser.maritalStatus || 'Célibataire'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Téléphone direct</span>
                </span>
                <span className="text-[10px] font-bold">
                  {currentUser.isPhonePublic ? (
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> Public
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Privé
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {currentUser.phoneNumber || '+229 01 00 00 00'}
              </p>
            </div>
          </div>
        </div>

        {/* Biographie & compétences */}
        <div className="pt-6 space-y-5">
          <div>
            <h2 className="text-xs font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-2">
              {language === 'fr' ? 'À propos de l\'ingénieur' : 'About the engineer'}
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {language === 'fr' ? currentUser.bioFr : currentUser.bioEn}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold text-[#0A1128] dark:text-slate-300 uppercase tracking-wider mb-2.5">
              {language === 'fr' ? 'Compétences validées' : 'Verified skills'}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.skills.map((skill) => (
                <Badge key={skill} variant="neutral" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Grille secondaire : Coordonnées, Réseaux sociaux & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Liens et coordonnées avec rendu accessible */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#090D1A] rounded-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0A1128] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0066FF]" />
              <span>{language === 'fr' ? 'Coordonnées & Réseaux Sociaux' : 'Contact & Networks'}</span>
            </h2>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Actifs & Vérifiés
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-4 h-4 text-[#0066FF] dark:text-cyan-400 shrink-0" aria-hidden="true" />
                <span className="text-slate-800 dark:text-slate-200 font-mono text-xs truncate">
                  {currentUser.email}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066FF] transition-colors" />
            </div>

            {currentUser.whatsappUrl && (
              <a
                href={currentUser.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">WhatsApp</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.githubUrl && (
              <a
                href={currentUser.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">GitHub</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.linkedinUrl && (
              <a
                href={currentUser.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 hover:bg-blue-50/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#0066FF] shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">LinkedIn</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#0066FF] opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.portfolioUrl && (
              <a
                href={currentUser.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-cyan-200/80 dark:border-cyan-900/50 hover:bg-cyan-50/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Portfolio</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-600 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.twitterUrl && (
              <a
                href={currentUser.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Twitter className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">X (Twitter)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.facebookUrl && (
              <a
                href={currentUser.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Facebook</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.instagramUrl && (
              <a
                href={currentUser.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-pink-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Instagram</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-pink-600 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.youtubeUrl && (
              <a
                href={currentUser.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">YouTube</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-red-600 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {currentUser.telegramUrl && (
              <a
                href={currentUser.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Telegram</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-sky-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </Card>

        {/* Certifications professionnelles */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#090D1A] rounded-3xl">
          <h2 className="text-xs font-bold text-[#0A1128] dark:text-slate-200 uppercase tracking-wider">
            {language === 'fr' ? 'Certifications & Accréditations' : 'Certifications & Accreditations'}
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Architecte Logiciel Agréé UEMOA & Bénin
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Émis par Sèmè City Tech Labs & DevConnect Bénin
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Spécialiste Sécurité & Résilience des Systèmes
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Conformité aux directives BCEAO & Cryptographie bancaire
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal d'édition de profil complet */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={language === 'fr' ? 'Modifier mes informations' : 'Edit my profile'}
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <Input
              label={language === 'fr' ? 'Nom complet (Prénom en minuscules, nom en majuscules)' : 'Full name'}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Ex: Josué AFFAGNON"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Règle CADEV 2026 : Seuls les noms de famille sont en majuscules (ex: Josué AFFAGNON).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={language === 'fr' ? 'Titre professionnel' : 'Job title'}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <Input
              label={language === 'fr' ? 'Rôle' : 'Role'}
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={language === 'fr' ? 'Taux horaire (FCFA/h)' : 'Hourly rate (FCFA/h)'}
              type="number"
              step="1000"
              value={editRate}
              onChange={(e) => setEditRate(Number(e.target.value))}
              required
            />
            <Input
              label={language === 'fr' ? 'Ville de résidence (Bénin)' : 'City (Benin)'}
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              required
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200/80 dark:border-slate-700/80 space-y-3">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Paramètres d'État Civil & Visibilité publique</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date de naissance (JJ/MM/AAAA)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    placeholder="JJ/MM/AAAA (ex: 18/04/1996)"
                    className={`w-full pl-3 pr-10 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                      parseBirthDateHelper(editBirthDate).isValid
                        ? 'border-emerald-500/80 focus:ring-emerald-500'
                        : editBirthDate.trim()
                        ? 'border-amber-400 focus:ring-amber-400'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-[#0066FF]'
                    }`}
                  />
                  <label
                    title="Choisir via calendrier"
                    className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-[#0066FF] dark:hover:text-cyan-400 cursor-pointer transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <input
                      type="date"
                      aria-label="Choisir via calendrier"
                      onChange={(e) => {
                        if (e.target.value) {
                          const [y, m, d] = e.target.value.split('-');
                          setEditBirthDate(`${d}/${m}/${y}`);
                        }
                      }}
                      className="sr-only"
                    />
                  </label>
                </div>

                <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={editIsBirthDatePublic}
                    onChange={(e) => setEditIsBirthDatePublic(e.target.checked)}
                    className="rounded text-[#0066FF]"
                  />
                  <span>Rendre ma date de naissance publique</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Situation matrimoniale
                </label>
                <select
                  value={editMaritalStatus}
                  onChange={(e) =>
                    setEditMaritalStatus(
                      e.target.value as 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Autre'
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm"
                >
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Autre">Autre</option>
                </select>

                <label className="flex items-center gap-2 mt-4 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={editIsMaritalStatusPublic}
                    onChange={(e) => setEditIsMaritalStatusPublic(e.target.checked)}
                    className="rounded text-[#0066FF]"
                  />
                  <span>Rendre ma situation matrimoniale publique</span>
                </label>
              </div>
            </div>

            <div>
              <Input
                label="Numéro de téléphone (+229 Bénin)"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+229 01 00 00 00"
              />
              <label className="flex items-center gap-2 mt-1 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={editIsPhonePublic}
                  onChange={(e) => setEditIsPhonePublic(e.target.checked)}
                  className="rounded text-[#0066FF]"
                />
                <span>Rendre mon numéro de téléphone public</span>
              </label>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Globe className="w-3.5 h-3.5 text-[#0066FF] dark:text-cyan-400" />
                <span>Réseaux Sociaux & Liens Publics</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Liens automatiques
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp
                </label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  placeholder="+229 01 00 00 00"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  <Linkedin className="w-3.5 h-3.5 text-[#0066FF]" /> LinkedIn
                </label>
                <input
                  type="text"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/... ou profil"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#0066FF]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  <Github className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" /> GitHub
                </label>
                <input
                  type="text"
                  value={editGithub}
                  onChange={(e) => setEditGithub(e.target.value)}
                  placeholder="https://github.com/... ou username"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#0066FF]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  <Twitter className="w-3.5 h-3.5 text-slate-900 dark:text-white" /> X (Twitter)
                </label>
                <input
                  type="text"
                  value={editTwitter}
                  onChange={(e) => setEditTwitter(e.target.value)}
                  placeholder="https://x.com/... ou @handle"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-slate-700"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-cyan-500" /> Portfolio ou Site Web
                </label>
                <input
                  type="text"
                  value={editPortfolio}
                  onChange={(e) => setEditPortfolio(e.target.value)}
                  placeholder="https://mon-site.dev"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" /> Facebook
                </label>
                <input
                  type="text"
                  value={editFacebook}
                  onChange={(e) => setEditFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'fr' ? 'Statut de disponibilité' : 'Availability status'}
            </label>
            <select
              value={editAvailability}
              onChange={(e) => setEditAvailability(e.target.value as typeof editAvailability)}
              className="w-full h-10 px-3 rounded-xl text-sm bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-100 dark:border-slate-800 outline-none"
            >
              <option value="available">Disponible immédiatement</option>
              <option value="open_to_offers">À l'écoute d'opportunités</option>
              <option value="busy">Occupé pour le moment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'fr' ? 'Biographie (Français)' : 'Bio (French)'}
            </label>
            <textarea
              rows={3}
              value={editBioFr}
              onChange={(e) => setEditBioFr(e.target.value)}
              className="w-full p-3 rounded-xl text-sm bg-white text-slate-900 border border-slate-300 dark:bg-[#090D1A] dark:text-slate-100 dark:border-slate-800 outline-none focus:ring-2 focus:ring-[#0066FF]"
              required
            />
          </div>

          <div>
            <Input
              label={language === 'fr' ? 'Compétences (séparées par des virgules)' : 'Skills (comma-separated)'}
              value={editSkills}
              onChange={(e) => setEditSkills(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setEditModalOpen(false)}
            >
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {language === 'fr' ? 'Enregistrer les modifications' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
